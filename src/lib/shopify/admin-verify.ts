/**
 * Shopify Admin API Utility for Purchase Verification
 */

import { SHOPIFY_CONFIG } from './client.js';

const SHOP = process.env.VITE_SHOPIFY_DOMAIN || process.env.SHOP || SHOPIFY_CONFIG.domain;
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;
const SHOP_ID = process.env.VITE_SHOPIFY_SHOP_ID || SHOPIFY_CONFIG.shopId;

/**
 * Resolves a Customer GID from an access token using the Customer Account API.
 */
export async function getCustomerIdFromToken(accessToken: string): Promise<string | null> {
  if (!SHOP_ID) {
    return null;
  }

  const query = `
    query {
      customer {
        id
      }
    }
  `;

  try {
    const response = await fetch(`https://shopify.com/${SHOP_ID}/account/customer/api/2024-10/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data?.customer?.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies if a customer has purchased a specific product.
 * Returns the order ID if found, otherwise null.
 */
export async function verifyPurchase(customerId: string, productId: string): Promise<string | null> {
  if (!ADMIN_API_TOKEN) {
    return null;
  }

  // Shopify Admin GraphQL Query to find orders for a customer
  const query = `
    query getCustomerOrders($customerId: ID!) {
      customer(id: $customerId) {
        orders(first: 50, query: "fulfillment_status:fulfilled") {
          edges {
            node {
              id
              lineItems(first: 50) {
                edges {
                  node {
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { customerId },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return null;
    }

    const orders = result.data?.customer?.orders?.edges || [];
    
    // Search through orders for the product
    for (const orderEdge of orders) {
      const order = orderEdge.node;
      const lineItems = order.lineItems.edges;
      
      const hasProduct = lineItems.some((item: any) => item.node.product?.id === productId);
      
      if (hasProduct) {
        return order.id; // Return the order ID that contains the product
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Validates a specific order directly if we have the order ID.
 */
export async function verifyOrderProduct(orderId: string, productId: string): Promise<boolean> {
  if (!ADMIN_API_TOKEN) return false;

  const query = `
    query getOrder($orderId: ID!) {
      order(id: $orderId) {
        lineItems(first: 50) {
          edges {
            node {
              product {
                id
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { orderId },
      }),
    });

    const result = await response.json();
    const lineItems = result.data?.order?.lineItems?.edges || [];
    
    return lineItems.some((item: any) => item.node.product?.id === productId);
  } catch (error) {
    return false;
  }
}
