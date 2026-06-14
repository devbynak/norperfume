import { useEffect } from "react";

/**
 * Ensures the site is always accessed via www.norperfume.com in production.
 * This prevents "split sessions" where a user is logged in on 'www' but not on the apex domain,
 * and fixes authentication state issues in mobile in-app browsers.
 */
const DomainCheck = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    
    // Only apply to production domain
    if (hostname === "norperfume.com") {
      const newUrl = `https://www.norperfume.com${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(newUrl);
    }
  }, []);

  return null;
};

export default DomainCheck;
