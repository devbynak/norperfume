import { customerQuery } from "./customer-account";

export interface CustomerProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailAddress?: { emailAddress: string };
  phoneNumber?: { phoneNumber: string };
  defaultAddress?: CustomerAddress | null;
  addresses: { nodes: CustomerAddress[] };
}

export interface CustomerAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zoneCode?: string;
  territoryCode?: string;
  zip?: string;
  phoneNumber?: string;
  formatted?: string[];
}

export interface CustomerOrder {
  id: string;
  number: number;
  name: string;
  processedAt: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      image?: { url: string; altText?: string | null } | null;
      variantTitle?: string;
      price?: { amount: string; currencyCode: string } | null;
      productId?: string | null;
      product?: { handle: string } | null;
    }>;
  };
  shippingAddress?: CustomerAddress | null;
  fulfillments?: {
    nodes: Array<{
      status?: string;
      trackingInformation?: Array<{ number?: string; url?: string; company?: string }>;
    }>;
  };
}

const PROFILE_QUERY = /* GraphQL */ `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        territoryCode
        zip
        phoneNumber
        formatted
      }
      addresses(first: 10) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          zoneCode
          territoryCode
          zip
          phoneNumber
          formatted
        }
      }
    }
  }
`;

const ORDERS_QUERY = /* GraphQL */ `
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          number
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 25) {
            nodes {
              title
              quantity
              variantTitle
              image { url altText }
              price { amount currencyCode }
              productId
            }
          }
          shippingAddress { formatted }
          fulfillments(first: 5) {
            nodes {
              status
              trackingInformation { number url company }
            }
          }
        }
      }
    }
  }
`;

export async function fetchCustomerProfile() {
  const data = await customerQuery<{ customer: CustomerProfile }>(PROFILE_QUERY);
  return data.customer;
}

export async function fetchCustomerOrders(first = 25) {
  const data = await customerQuery<{ customer: { orders: { nodes: any[] } } }>(
    ORDERS_QUERY,
    { first },
  );
  
  if (!data?.customer?.orders?.nodes) return [];
  
  return data.customer.orders.nodes.map(order => ({
    ...order,
    lineItems: {
      ...order.lineItems,
      nodes: (order.lineItems?.nodes || []).map((item: any) => {
        let handle = "products";
        const titleLower = item.title?.toLowerCase() || "";
        const idLower = item.productId?.toLowerCase() || "";
        
        if (titleLower.includes("aqua") || idLower.includes("9197068255458")) {
          handle = "aqua";
        } else if (titleLower.includes("musk") || titleLower.includes("mask") || idLower.includes("9197068222690")) {
          handle = "mask";
        }
        
        return {
          ...item,
          product: { handle }
        };
      })
    }
  }));
}

const UPDATE_CUSTOMER = /* GraphQL */ `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer { id firstName lastName }
      userErrors { field message code }
    }
  }
`;

const ADDRESS_CREATE = /* GraphQL */ `
  mutation AddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message code }
    }
  }
`;

const ADDRESS_UPDATE = /* GraphQL */ `
  mutation AddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message code }
    }
  }
`;

const ADDRESS_DELETE = /* GraphQL */ `
  mutation AddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors { field message code }
    }
  }
`;

interface UserError { field?: string[]; message: string; code?: string }

function throwIfErrors(errors?: UserError[]) {
  if (errors && errors.length) throw new Error(errors[0].message);
}

export async function updateCustomerName(firstName: string, lastName: string) {
  const data = await customerQuery<{ customerUpdate: { userErrors: UserError[] } }>(
    UPDATE_CUSTOMER,
    { input: { firstName, lastName } },
  );
  throwIfErrors(data.customerUpdate.userErrors);
}

export async function updateCustomerPhone(phoneNumber: string) {
  const data = await customerQuery<{ customerUpdate: { userErrors: UserError[] } }>(
    UPDATE_CUSTOMER,
    { input: { phone: phoneNumber || null } },
  );
  throwIfErrors(data.customerUpdate.userErrors);
}

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zoneCode?: string;
  territoryCode?: string;
  zip?: string;
  phoneNumber?: string;
}

export async function createCustomerAddress(address: AddressInput, defaultAddress = false) {
  const data = await customerQuery<{ customerAddressCreate: { userErrors: UserError[] } }>(
    ADDRESS_CREATE,
    { address, defaultAddress },
  );
  throwIfErrors(data.customerAddressCreate.userErrors);
}

export async function updateCustomerAddress(addressId: string, address: AddressInput, defaultAddress = false) {
  const data = await customerQuery<{ customerAddressUpdate: { userErrors: UserError[] } }>(
    ADDRESS_UPDATE,
    { addressId, address, defaultAddress },
  );
  throwIfErrors(data.customerAddressUpdate.userErrors);
}

export async function deleteCustomerAddress(addressId: string) {
  const data = await customerQuery<{ customerAddressDelete: { userErrors: UserError[] } }>(
    ADDRESS_DELETE,
    { addressId },
  );
  throwIfErrors(data.customerAddressDelete.userErrors);
}