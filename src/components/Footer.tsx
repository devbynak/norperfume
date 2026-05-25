import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

// Custom Threads SVG Icon matching Lucide style
const ThreadsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19.25 8.5C18.5 5.5 15.5 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c2.76 0 5-2.24 5-5V13.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v1c-.5-.7-1.22-1-2-1-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.78 0 1.5-.33 2-1v1c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V11.5c0-3.59-2.91-6.5-6.5-6.5S6.5 7.91 6.5 11.5s2.91 6.5 6.5 6.5c1.38 0 2.63-.56 3.54-1.46" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmed }),
      });
      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (err) {
        throw new Error("Invalid server response");
      }

      if (result.success) {
        haptic("success");
        toast.success("Thank you for subscribing!");
        setEmail("");
      } else {
        throw new Error(result.message || "Subscription failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#121212]/30 to-[#070707]/90 backdrop-blur-2xl border-t border-white/10 pt-16 pb-12 md:pt-20 md:pb-16 px-8 md:px-16 mt-8 md:mt-16 overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 pb-10">
          
          {/* Column 1: Brand Logo & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" aria-label="NOR home" className="inline-flex group">
              <img 
                src="/5.png" 
                alt="NOR" 
                className="h-16 md:h-20 w-auto group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-sm font-light">
              Luxury car fragrances crafted in India with 100% natural oils for those who drive with purpose.
            </p>
            
            {/* Integrated Newsletter Form (Luxury Underline Redesign) */}
            <div className="space-y-4 pt-2">
              <label htmlFor="newsletter-email" className="block text-foreground/90 font-semibold text-[10px] tracking-widest uppercase cursor-pointer">
                Join the community
              </label>
              <form
                onSubmit={handleSubmit}
                className="flex items-center justify-between border-b border-white/10 pb-2 pt-1 transition-all duration-500 hover:border-white/30 focus-within:border-primary max-w-sm group/newsletter"
              >
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  maxLength={255}
                  autoComplete="email"
                  required
                  className="newsletter-input flex-1 bg-transparent text-base md:text-xs text-foreground placeholder:text-muted-foreground/35 outline-none border-none ring-0 focus:ring-0 p-0 transition-colors duration-500 focus:placeholder:text-muted-foreground/20"
                />
                <button
                  type="submit"
                  onClick={() => haptic("light")}
                  disabled={isLoading}
                  className="text-muted-foreground/30 group-hover/newsletter:text-primary group-focus-within/newsletter:text-primary transition-all duration-500 shrink-0 disabled:opacity-50 hover:translate-x-1.5 pl-3 py-1"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Redesigned Social Icons */}
            <div className="flex gap-3 pt-4">
              <a 
                href="https://www.instagram.com/norperfumeofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-300 hover:bg-primary/[0.08] hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
              </a>

              <a 
                href="https://www.threads.net/@norperfumeofficial?igshid=NTc4MTIwNjQ2YQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-300 hover:bg-primary/[0.08] hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                aria-label="Threads"
              >
                <ThreadsIcon className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
              </a>

              <a 
                href="https://www.facebook.com/share/18xj5j1adN/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-300 hover:bg-primary/[0.08] hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
              </a>

              <a 
                href="mailto:support@norperfume.com" 
                className="group w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-300 hover:bg-primary/[0.08] hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop links */}
          <div>
            <h4 className="text-foreground/90 font-semibold text-xs tracking-[0.25em] uppercase mb-5">Shop</h4>
            <ul className="space-y-4 text-muted-foreground/65 text-[13px] md:text-sm font-light">
              <li>
                <Link to="/products" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?collection=best-seller" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/products?collection=new-arrival" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div>
            <h4 className="text-foreground/90 font-semibold text-xs tracking-[0.25em] uppercase mb-5">Company</h4>
            <ul className="space-y-4 text-muted-foreground/65 text-[13px] md:text-sm font-light">
              <li><Link to="/about" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Contact</Link></li>
              <li><Link to="/track-order" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Track Order</Link></li>
              <li><a href="mailto:business@norperfume.com" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Business Enquiry</a></li>
            </ul>
          </div>

          {/* Column 4: Legal / Policies */}
          <div>
            <h4 className="text-foreground/90 font-semibold text-xs tracking-[0.25em] uppercase mb-5">Legal</h4>
            <ul className="space-y-4 text-muted-foreground/65 text-[13px] md:text-sm font-light">
              <li><Link to="/privacy-policy" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Shipping Policy</Link></li>
              <li><Link to="/legal-notice" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Legal Notice</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground/40 text-[10px] tracking-[0.2em] font-light uppercase mt-12">
          <div>
            <p>© {new Date().getFullYear()} NOR PERFUME. All rights reserved.</p>
          </div>
          <div>
            <p>Crafted with pride in India</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
