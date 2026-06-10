
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
const shopId = getEnvVar('VITE_SHOPIFY_SHOP_ID');
const apiVersion = getEnvVar('VITE_SHOPIFY_API_VERSION') || '2024-10';

const storefrontEndpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
const customerEndpoint = `https://shopify.com/${shopId}/auth/oauth/authorize`;

const query = `
  query {
    shop {
      name
      description
    }
  }
`;

async function testConnection() {
  console.log(`--- Connectivity Audit ---`);
  console.log(`Storefront Endpoint: ${storefrontEndpoint}`);
  console.log(`Customer Auth Endpoint: ${customerEndpoint}`);
  
  try {
    console.log('\n1. Testing Storefront API...');
    const sfRes = await fetch(storefrontEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (sfRes.ok) {
      console.log('✅ Storefront API is reachable and active.');
    } else {
      console.error(`❌ Storefront API returned error ${sfRes.status}`);
    }

    console.log('\n2. Testing Customer Account API Availability...');
    // We can't POST to the authorize endpoint, but we can check if the URL exists/is reachable
    const custRes = await fetch(customerEndpoint, { method: 'HEAD' });
    if (custRes.status === 200 || custRes.status === 405 || custRes.status === 302) {
      console.log(`✅ Customer Account API is active at shopify.com/${shopId}`);
    } else {
      console.error(`❌ Customer Account API returned unexpected status: ${custRes.status}`);
    }

  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
