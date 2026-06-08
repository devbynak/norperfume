import { useState, useEffect } from "react";
import { Menu, Search, User, ShoppingBag, X, Package, ChevronLeft, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
// Customer Account API uses internal /login + /account routes (no Shopify redirect).
import logo from "@/assets/logo.png";
import SearchDialog from "@/components/SearchDialog";
import { haptic } from "@/lib/haptics";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [] } = useHybridProducts();
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, logout, login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const goToAccount = () => {
    haptic("light");
    if (isAuthenticated) {
      navigate("/account");
    } else {
      login("/account");
    }
  };

  const menuItems = [
    { label: "Home", href: "/", external: false },
    { label: "Products", href: "/products", external: false },
    { label: "Blogs", href: "/blogs", external: false },
    { label: "FAQ", href: "/faq", external: false },
    { label: "About Us", href: "/about", external: false },
    { label: "Track My Order", href: "/track-order", external: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = (e: React.MouseEvent) => {
    haptic("light");
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed left-0 right-0 z-50 px-4 py-2 lg:px-4 lg:py-1 top-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="max-w-7xl lg:max-w-4xl mx-auto flex items-center justify-between bg-surface-glass rounded-full px-6 py-3 lg:px-5 lg:py-1 relative border border-white/5 shadow-2xl shadow-black/40 backdrop-blur-md">
          {mobileSearchActive ? (
            <div className="w-full flex items-center gap-3 z-10 py-1">
              <button 
                onClick={() => { haptic("selection"); setMobileSearchActive(false); setSearchQuery(""); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground/60 hover:text-foreground shrink-0 outline-none"
                aria-label="Close search"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-1 group">
                <input
                  id="mobile-search-input"
                  name="q"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/40 px-5 py-1.5 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { haptic("light"); setSearchQuery(""); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => { haptic("selection"); setMenuOpen(!menuOpen); }}
                className="flex items-center gap-3 text-foreground z-10 group outline-none"
                aria-label="Toggle menu"
              >
                <span className="hidden sm:inline font-display text-[13px] font-semibold tracking-[0.2em] uppercase transition-colors group-hover:text-primary">
                  Menu
                </span>
                <div className="flex flex-col gap-[5px] w-5 items-start">
                  <div className={`h-[1.5px] bg-current duration-500 [transition-timing-function:cubic-bezier(0.68,-0.6,0.32,1.6)] origin-center ${menuOpen ? 'rotate-45 translate-y-[3.25px] w-5 bg-primary' : 'w-5'}`} />
                  <div className={`h-[1.5px] bg-current duration-500 [transition-timing-function:cubic-bezier(0.68,-0.6,0.32,1.6)] origin-center ${menuOpen ? '-rotate-45 -translate-y-[3.25px] w-5 bg-primary' : 'w-3.5 group-hover:w-5'}`} />
                </div>
              </button>

              <Link to="/" onClick={handleLogoClick} aria-label="NOR home" className="group no-active-transform shrink-0 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 outline-none focus:outline-none [-webkit-tap-highlight-color:transparent]">
                <img 
                  src={logo} 
                  alt="NOR" 
                  className="h-9 w-auto sm:h-11 md:h-12 lg:h-14 object-contain transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" 
                  {...({ fetchpriority: "high" } as any)}
                />
              </Link>

              <div className="flex items-center gap-4 z-10">
                <Search 
                  onClick={() => { 
                    haptic("light"); 
                    if (window.innerWidth < 640) {
                      setMobileSearchActive(true); 
                    } else {
                      setSearchOpen(true); 
                    }
                  }} 
                  className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" 
                />
                <button
                  onClick={goToAccount}
                  className="hidden sm:block outline-none"
                  aria-label={isAuthenticated ? "Open account" : "Login"}
                >
                  <User className={`w-5 h-5 transition-colors ${isAuthenticated ? "text-primary" : "text-foreground/70 hover:text-foreground"}`} />
                </button>
                <button onClick={() => { haptic("light"); setIsOpen(true); }} className="relative">
                  <ShoppingBag className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile search backdrop */}
      {mobileSearchActive && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden" 
          onClick={() => { setMobileSearchActive(false); setSearchQuery(""); }}
        />
      )}

      {/* Mobile search dropdown container */}
      <AnimatePresence>
        {mobileSearchActive && searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-24 left-4 right-4 z-40 bg-[#0d0d0d]/90 backdrop-blur-[32px] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto p-4 space-y-3 sm:hidden scrollbar-hide"
          >
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[10px] font-display tracking-[0.3em] uppercase text-white/40">Results ({filteredProducts.length})</p>
            </div>
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No products found.</p>
            ) : (
              filteredProducts.map((product, idx) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    haptic("light");
                    setMobileSearchActive(false);
                    setSearchQuery("");
                    navigate(`/product/${product.id}`);
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-[20px] bg-white/[0.03] border border-white/5 active:bg-white/[0.08] transition-all text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm font-bold text-foreground tracking-tight uppercase line-clamp-1">{product.name}</p>
                    <p className="text-primary font-bold text-sm font-numbers-inter">{formatCurrency(product.price, product.currencyCode)}</p>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-[61] h-[100dvh] w-full max-w-[340px] bg-[#0d0d0d]/80 backdrop-blur-[32px] border-r border-white/10 flex flex-col shadow-2xl overflow-hidden !rounded-none"
            >
              {/* Subtle background light gradients */}
              <div className="absolute top-[-10%] left-[-10%] w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[10%] right-[-5%] w-[150px] h-[150px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="flex items-center justify-between px-8 py-8 shrink-0 relative z-10">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src={logo} alt="NOR" className="h-14 w-auto" />
                </Link>
                <button 
                  onClick={() => { haptic("selection"); setMenuOpen(false); }} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors" 
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ScrollArea className="flex-1 relative z-10 px-8 py-4 scroll-fade-mask">
                <motion.div
                  className="flex flex-col h-full"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
                    closed: {},
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                      <motion.div
                        key={item.label}
                        variants={{
                          closed: { opacity: 0, x: -20 },
                          open: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative overflow-hidden group/item"
                      >
                        {item.external ? (
                          <a
                            onClick={() => { haptic("light"); setMenuOpen(false); }}
                            className={`font-display text-[26px] py-4 transition-all block relative z-10 ${isActive(item.href) ? 'text-primary' : 'text-foreground/90 group-hover/item:text-primary'}`}
                            href={item.href}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            onClick={() => { haptic("light"); setMenuOpen(false); }}
                            className={`font-display text-[26px] py-4 transition-all block relative z-10 ${isActive(item.href) ? 'text-primary' : 'text-foreground/90 group-hover/item:text-primary'}`}
                            to={item.href}
                          >
                            {item.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-12 pt-10 pb-10 space-y-8"
                    variants={{
                      closed: { opacity: 0, y: 20 },
                      open: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => {
                          haptic("light");
                          setMenuOpen(false);
                          goToAccount();
                        }}
                        className="group flex flex-col items-center gap-2 outline-none"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border transition-all duration-300 ${isActive("/account") || isActive("/login") ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(202,138,4,0.2)]" : "border-white/5 group-hover:border-primary/30 group-hover:bg-white/10"}`}
                        >
                          <User className={`w-6 h-6 transition-colors ${isAuthenticated ? "text-primary" : "text-foreground"}`} />
                        </motion.div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 group-hover:text-foreground/60 transition-colors">Account</span>
                      </button>
                      
                      <Link
                        to="/orders"
                        onClick={() => { haptic("light"); setMenuOpen(false); }}
                        className="group flex flex-col items-center gap-2 outline-none"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border transition-all duration-300 ${isActive("/orders") ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(202,138,4,0.2)]" : "border-white/5 group-hover:border-primary/30 group-hover:bg-white/10"}`}>
                          <Package className="w-6 h-6 text-foreground" />
                        </motion.div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 group-hover:text-foreground/60 transition-colors">Orders</span>
                      </Link>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        haptic("warning");
                        setMenuOpen(false);
                        if (isAuthenticated) {
                          logout();
                        } else {
                          login();
                        }
                      }}
                      className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-display text-sm tracking-[0.3em] uppercase transition-all duration-300 ${isAuthenticated
                          ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                          : "bg-primary text-primary-foreground font-bold hover:opacity-90"
                        }`}
                    >
                      {isAuthenticated ? (
                        <>
                          <LogOut className="w-4 h-4" />
                          Logout
                        </>
                      ) : "Login"}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
