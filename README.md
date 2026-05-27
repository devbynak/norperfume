# NOR PERFUME| Luxury Car Fragrance Storefront

NOR is a high-fidelity, production-ready storefront designed for a luxury automotive fragrance brand. This project is built using a modern stack (Vite, React, TypeScript, Tailwind CSS) and is deeply integrated with the Shopify eco-system.

## 🚀 Deployment & Post-Build Setup

To ensure the storefront is fully operational, the following manual steps **must** be completed in your hosting environment (Vercel) and the codebase.

### 1. Vercel Environment Variables
You must add the following environment variables in your Vercel Dashboard (`Settings > Environment Variables`) for the serverless functions and Shopify integration to work:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `SHOP` | Your Shopify store domain (e.g., `shop.norperfume.com`) | Shopify Admin |
| `ADMIN_API_TOKEN` | Shopify Admin API Access Token | Shopify App Settings |
| `PUBLIC_STORE_DOMAIN` | Your public domain (e.g., `norperfume.com`) | Domain Provider |
| `PUBLIC_STOREFRONT_ACCESS_TOKEN` | Shopify Storefront API Token | Shopify App Settings |

### 2. Meta Pixel Update
The Meta Pixel is currently initialized with a placeholder ID. To use your own:
1.  Open `index.html` and search for `1006383931833299`. Replace it with your actual **Meta Pixel ID**.
2.  Open `src/lib/meta-pixel.ts` and update the `PIXEL_ID` constant at the top of the file.

### 3. Serverless Functions
The newsletter subscription logic is handled by `/api/newsletter.js`.
*   Ensure your Vercel project is configured to look for the `/api` directory.
*   The `ADMIN_API_TOKEN` mentioned above is critical for this function to securely add subscribers to your Shopify Customers list.

## 🛠 Features

*   **Hybrid Product Engine**: Blends high-performance local data with real-time Shopify inventory and pricing.
*   **Production Legal Policy**: 1:1 verbatim legal coverage for Returns, Shipping, Privacy, and Terms.
*   **Advanced SEO**: Full JSON-LD Schema (Product, Organization, FAQ) for maximum search engine authority.
*   **Conversion Tracking**: Meta Pixel integration for 'ViewContent', 'AddToCart', and 'InitiateCheckout' events.
*   **Premium UX**: Sloped marquee banners, InterNumbers numeric font enforcement, and high-contrast editorial design.

## 📦 Project Structure

*   `/src/components`: UI components and design system.
*   `/src/pages`: Main storefront views and policy documents.
*   `/src/lib`: Shopify logic, Pixel utilities, and formatting tools.
*   `/api`: Serverless backend functions (Vercel compatible).
*   `/public`: Static assets, `robots.txt`, and favicon.

## 💻 Local Development

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Create a `.env.local` file with the variables listed in the Deployment section.
4.  Run the development server: `npm run dev`.

---
© 2025 NOR Perfume. Built with precision in Kerala, India.
