import { type Product } from "@/data/products";
import { shopifyQuery } from "./client";

type Nullable<T> = T | null;

interface ShopifyMoneyNode {
  amount: string;
  currencyCode: string;
}

interface ShopifyImageNode {
  url: string;
  altText: Nullable<string>;
}

interface ShopifyCartProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  images: {
    edges: Array<{ node: ShopifyImageNode }>;
  };
}

interface ShopifyCartVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyNode;
  compareAtPrice: Nullable<ShopifyMoneyNode>;
  image: Nullable<ShopifyImageNode>;
  product: ShopifyCartProductNode;
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  merchandise: Nullable<ShopifyCartVariantNode>;
}

interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoneyNode;
    totalAmount: ShopifyMoneyNode;
  };
  lines: {
    edges: Array<{ node: ShopifyCartLineNode }>;
  };
}

interface ShopifyCartQueryResponse {
  cart: Nullable<ShopifyCartNode>;
}

interface ShopifyCartMutationResponse {
  cartCreate?: ShopifyCartPayload;
  cartLinesAdd?: ShopifyCartPayload;
  cartLinesUpdate?: ShopifyCartPayload;
  cartLinesRemove?: ShopifyCartPayload;
  cartBuyerIdentityUpdate?: ShopifyCartPayload;
}

interface ShopifyCartPayload {
  cart: Nullable<ShopifyCartNode>;
  userErrors: Array<{ field?: string[]; message: string }>;
}

export interface ShopifyCartItem {
  lineId: string;
  product: Product;
  quantity: number;
}

export interface ShopifyCartSnapshot {
  id: string;
  checkoutUrl: string;
  items: ShopifyCartItem[];
  totalItems: number;
  totalPrice: number;
  currencyCode: string;
}

const CART_LINE_FIELDS = `
  id
  quantity
  merchandise {
    ... on ProductVariant {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      image {
        url(transform: { maxWidth: 1200, preferredContentType: WEBP })
        altText
      }
      product {
        id
        title
        handle
        description
        availableForSale
        tags
        images(first: 4) {
          edges {
            node {
              url(transform: { maxWidth: 1600, preferredContentType: WEBP })
              altText
            }
          }
        }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        ${CART_LINE_FIELDS}
      }
    }
  }
`;

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation UpdateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function parseMoney(value?: Nullable<ShopifyMoneyNode>) {
  if (!value?.amount) return undefined;
  const amount = Number(value.amount);
  return Number.isFinite(amount) ? amount : undefined;
}

function calculateDiscount(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function mapCartProduct(variant: ShopifyCartVariantNode): Product {
  const galleryImages = variant.product.images.edges
    .map((edge) => edge.node.url)
    .filter((image): image is string => Boolean(image));
  const images = [
    variant.image?.url,
    ...galleryImages,
  ].filter((image): image is string => Boolean(image));
  const price = parseMoney(variant.price) ?? 0;
  const originalPrice = parseMoney(variant.compareAtPrice);

  return {
    id: variant.product.handle,
    shopifyHandle: variant.product.handle,
    shopifyId: variant.product.id,
    variantId: variant.id,
    name: variant.product.title || variant.product.handle,
    price,
    originalPrice,
    currencyCode: variant.price.currencyCode || "INR",
    image: images[0] || "",
    images,
    description: variant.product.description || "",
    tags: variant.product.tags,
    discount: calculateDiscount(price, originalPrice),
    availableForSale: variant.availableForSale ?? variant.product.availableForSale ?? true,
    source: "shopify",
  };
}

function mapCartSnapshot(cart: ShopifyCartNode): ShopifyCartSnapshot {
  const items = cart.lines.edges
    .map(({ node }) => {
      if (!node.merchandise) return undefined;

      return {
        lineId: node.id,
        product: mapCartProduct(node.merchandise),
        quantity: node.quantity,
      } satisfies ShopifyCartItem;
    })
    .filter(Boolean) as ShopifyCartItem[];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    items,
    totalItems: cart.totalQuantity,
    totalPrice:
      parseMoney(cart.cost.totalAmount) ??
      parseMoney(cart.cost.subtotalAmount) ??
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    currencyCode: cart.cost.totalAmount.currencyCode || "INR",
  };
}

function ensureCartPayload(payload?: ShopifyCartPayload) {
  const errors = payload?.userErrors.map((error) => error.message).filter(Boolean) || [];

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }

  if (!payload?.cart) {
    throw new Error("Shopify cart response was empty.");
  }

  return payload.cart;
}

export async function fetchShopifyCart(cartId: string) {
  const data = await shopifyQuery<ShopifyCartQueryResponse>(GET_CART_QUERY, { cartId });

  if (!data.cart) {
    throw new Error("Shopify cart was not found.");
  }

  return mapCartSnapshot(data.cart);
}

export async function createShopifyCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
  customerAccessToken?: string,
) {
  const data = await shopifyQuery<ShopifyCartMutationResponse>(CREATE_CART_MUTATION, {
    lines,
    buyerIdentity: customerAccessToken ? { customerAccessToken } : null,
  });

  return mapCartSnapshot(ensureCartPayload(data.cartCreate));
}

export async function addShopifyCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
) {
  const data = await shopifyQuery<ShopifyCartMutationResponse>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines,
  });

  return mapCartSnapshot(ensureCartPayload(data.cartLinesAdd));
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
) {
  const data = await shopifyQuery<ShopifyCartMutationResponse>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines,
  });

  return mapCartSnapshot(ensureCartPayload(data.cartLinesUpdate));
}

export async function removeShopifyCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyQuery<ShopifyCartMutationResponse>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
  });

  return mapCartSnapshot(ensureCartPayload(data.cartLinesRemove));
}

export async function syncShopifyCartBuyerIdentity(
  cartId: string,
  email?: string,
  customerAccessToken?: string,
) {
  const data = await shopifyQuery<ShopifyCartMutationResponse>(
    CART_BUYER_IDENTITY_UPDATE_MUTATION,
    {
      cartId,
      buyerIdentity: {
        email,
        customerAccessToken,
      },
    },
  );

  return mapCartSnapshot(ensureCartPayload(data.cartBuyerIdentityUpdate));
}
