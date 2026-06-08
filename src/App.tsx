import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";

// Import Home page directly for instant initial load
import Index from "./pages/Index.tsx";

// Lazy-load internal pages
const Products = lazy(() => import("./pages/Products.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const LegalNotice = lazy(() => import("./pages/LegalNotice.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const Journal = lazy(() => import("./pages/Journal.tsx"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomerAuthProvider>
      <CartProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <CartDrawer />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </CustomerAuthProvider>
  </QueryClientProvider>
);

export default App;
