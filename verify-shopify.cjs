
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const domain = getEnvVar('VITE_SHOPIFY_DOMAIN');
const accessToken = getEnvVar('VITE_SHOPIFY_ACCESS_TOKEN');
const apiVersion = getEnvVar('VITE_SHOPIFY_API_VERSION') || '2024-10';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

const query = `
  query {
    shop {
      name
      description
    }
    products(first: 5) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
`;

async function testConnection() {
  console.log(`Connecting to: ${endpoint}`);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      const text = await response.text();
      console.error(text);
      return;
    }

    const json = await response.json();
    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    } else {
      console.log('Successfully connected to Shopify!');
      console.log('Shop Name:', json.data.shop.name);
      console.log('Products found:', json.data.products.edges.length);
      json.data.products.edges.forEach(edge => {
        console.log(` - ${edge.node.title} (${edge.node.handle})`);
      });
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
