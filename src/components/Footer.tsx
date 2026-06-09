import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";
import logo from "@/assets/logo.png";

// Custom Threads SVG Icon matching the provided white icon
const ThreadsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 440 511.43"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M342.383 237.038a177.282 177.282 0 00-6.707-3.046c-3.948-72.737-43.692-114.379-110.429-114.805-38.505-.255-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.096 56.864-28.096.204 0 .408 0 .61.002 21.974.14 38.555 6.529 49.287 18.987 7.81 9.071 13.034 21.606 15.621 37.425-19.483-3.311-40.553-4.329-63.077-3.038-63.45 3.655-104.24 40.661-101.501 92.08 1.391 26.083 14.385 48.523 36.587 63.181 18.772 12.391 42.95 18.45 68.077 17.079 33.183-1.819 59.215-14.48 77.377-37.63 13.793-17.58 22.516-40.363 26.368-69.069 15.814 9.544 27.535 22.103 34.007 37.2 11.006 25.665 11.648 67.84-22.764 102.223-30.15 30.121-66.392 43.151-121.164 43.554-60.758-.45-106.708-19.935-136.583-57.915-27.976-35.562-42.434-86.93-42.973-152.674.539-65.746 14.997-117.114 42.973-152.676 29.875-37.979 75.824-57.463 136.582-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.676 42.248 34.236 69.688L440 161.532c-9.163-33.775-23.582-62.881-43.203-87.017C357.031 25.59 298.872.519 223.936 0h-.3C148.851.518 91.344 25.683 52.709 74.795 18.331 118.499.598 179.308.002 255.535l-.002.18.002.18c.596 76.225 18.329 137.037 52.707 180.741 38.635 49.11 96.142 74.277 170.927 74.794h.3c66.486-.462 113.352-17.868 151.96-56.442 50.51-50.463 48.99-113.718 32.342-152.549-11.945-27.847-34.716-50.463-65.855-65.401zM227.587 344.967c-27.808 1.567-56.699-10.916-58.124-37.651-1.056-19.823 14.108-41.942 59.831-44.577a266.87 266.87 0 0115.422-.45c16.609 0 32.145 1.613 46.271 4.701-5.268 65.798-36.172 76.483-63.4 77.977z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M379.56,131.67A172.4,172.4,0,0,0,256.67,80.73C161,80.73,83.05,158.64,83.05,254.42a173.47,173.47,0,0,0,23.2,86.82l-24.65,90,92.08-24.17a173.55,173.55,0,0,0,83,21.17h.07c95.73,0,173.69-77.91,173.69-173.69A172.73,172.73,0,0,0,379.53,131.7l0,0ZM256.72,399a144.17,144.17,0,0,1-73.52-20.14l-5.29-3.15L123.27,390l14.59-53.27-3.42-5.47a143.29,143.29,0,0,1-22.11-76.81C112.33,174.81,177.1,110,256.8,110A144.34,144.34,0,0,1,401.12,254.48c-.07,79.67-64.83,144.46-144.41,144.46v0ZM335.87,290.8c-4.32-2.2-25.68-12.67-29.65-14.12s-6.85-2.19-9.8,2.2-11.22,14.11-13.76,17-5.06,3.29-9.37,1.09-18.35-6.77-34.92-21.56c-12.88-11.5-21.61-25.74-24.15-30s-.29-6.71,1.92-8.83c2-1.93,4.32-5.06,6.51-7.6s2.88-4.32,4.32-7.26.74-5.42-.35-7.6-9.8-23.55-13.34-32.25c-3.49-8.51-7.12-7.32-9.79-7.47s-5.42-.13-8.29-.13a16,16,0,0,0-11.57,5.41c-4,4.32-15.2,14.86-15.2,36.22s15.54,42,17.72,44.91,30.61,46.76,74.14,65.54c10.34,4.44,18.42,7.11,24.72,9.18a60,60,0,0,0,27.32,1.71c8.35-1.23,25.68-10.49,29.31-20.62s3.63-18.83,2.55-20.62-3.91-3-8.29-5.22l0,0Z" />
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
    <footer className="relative bg-black/[0.02] backdrop-blur-2xl border-t border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent pt-16 pb-12 md:pt-24 md:pb-20 px-6 sm:px-8 md:px-16 mt-8 md:mt-24 overflow-hidden">
      {/* Top Blend Effect to merge with section above */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10" />
      
      {/* Thin Separator Line for definition */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent z-20" />
      
      {/* Premium ambient glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 lg:gap-10 pb-12">
          
          {/* Column 1: Brand Logo & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" aria-label="NOR home" className="inline-flex group relative">
              {/* Subtle Background Glow behind logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[140%] bg-primary/[0.08] rounded-full blur-[40px] pointer-events-none z-0 group-hover:bg-primary/[0.12] transition-colors duration-500" />
              
              <img 
                src="/5.png" 
                alt="NOR PERFUME" 
                className="h-16 md:h-24 w-auto group-hover:scale-105 transition-transform duration-500 relative z-10" 
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

              <a 
                href="https://wa.me/917994070206" 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-300 hover:bg-primary/[0.08] hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
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
              <li><Link to="/blogs" className="hover:text-primary hover:translate-x-1 transition-all duration-300 block">Blogs</Link></li>
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
