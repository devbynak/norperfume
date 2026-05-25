import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: Record<string, unknown>;
}

const SEO = ({
  title = "NOR PERFUME | Official Online Store",
  description = "Experience automotive luxury with NOR's premium car fragrances. Handcrafted in India with 100% natural oils and zero-liquid technology for a lasting, sophisticated scent.",
  keywords = "nor, norperfume,nor perfume, luxury car perfume, car perfume, luxury car fragrance, automotive scent, premium car freshener, natural oil car perfume, NOR car perfume, made in India car fragrance",
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonical = "https://www.norperfume.com",
  schema
}: SEOProps) => {
  useEffect(() => {
    // Basic Meta Tags
    document.title = title;

    const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // Open Graph
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:image", ogImage, "property");
    updateMeta("og:type", ogType, "property");
    updateMeta("og:url", window.location.href, "property");
    updateMeta("og:site_name", "NOR PERFUME | Premium Handcrafted Car Fragrances", "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical || window.location.href);

    // Schema.org (JSON-LD)
    if (schema) {
      let scriptSchema = document.getElementById("json-ld-schema");
      if (!scriptSchema) {
        scriptSchema = document.createElement("script");
        scriptSchema.id = "json-ld-schema";
        scriptSchema.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup schema on unmount if necessary
      const scriptSchema = document.getElementById("json-ld-schema");
      if (scriptSchema) {
        // We keep it or clear it depending on page transitions
      }
    };
  }, [title, description, keywords, ogImage, ogType, canonical, schema]);

  return null;
};

export default SEO;
