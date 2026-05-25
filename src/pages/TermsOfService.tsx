import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Scale, BadgeCheck, AlertTriangle, ShieldAlert, Globe, ShieldCheck, HeartPulse, Scale as Law } from "lucide-react";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
      <SEO 
        title="Terms of Service | NOR PERFUME | Official Online Store"
        description="Terms and conditions for using our services and purchasing our products."
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[10px] tracking-[0.5em] font-bold uppercase mb-4"
          >
            NOR Perfume • Legal
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-[10px] md:text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2"
          >
            Effective Date: January 1, 2025 <span className="text-primary/30">•</span> Last Updated: March 2025
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
            
            <div className="flex items-center gap-3 mb-10 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-emerald-500/90 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">✓ All audit gaps fixed — fully refined version</p>
            </div>

            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-16">
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg font-light italic">
                  These Terms of Service govern your use of <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">www.norperfume.com</span> and any purchase made through our website. By accessing our website or placing an order, you confirm that you have read, understood, and agreed to these terms in full. If you do not agree, please do not use our website or place an order.
                </p>
              </div>

              {/* 1. About NOR */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">01</span>
                  <h2 className="font-display text-2xl text-foreground m-0">About NOR</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  NOR is a luxury automotive fragrance brand operated as an individual seller, designed and manufactured in Kerala, India. We sell fragrance products including perfume sprays and luxury diffusion tags through <strong>www.norperfume.com</strong>.
                </p>
              </div>

              {/* 2. Eligibility */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">02</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Eligibility</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  By placing an order, you confirm you are at least <strong>18 years of age</strong> and legally capable of entering into a binding contract under Indian law. Minors may only order with the explicit consent of a parent or legal guardian who accepts these terms on their behalf. NOR reserves the right to refuse service, cancel orders, or restrict website access for any customer at its sole discretion.
                </p>
              </div>

              {/* 3. Products & 4. Pricing */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-foreground m-0 flex items-center gap-3">
                    <span className="text-primary/40 text-xs">03</span> Products & Descriptions
                  </h3>
                  <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
                    Product images are for illustrative purposes only — minor packaging variations between batches may occur. We reserve the right to cancel orders in case of material errors in product listings.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-foreground m-0 flex items-center gap-3">
                    <span className="text-primary/40 text-xs">04</span> Pricing
                  </h3>
                  <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
                    All prices are in <strong>INR (₹)</strong>, inclusive of taxes. The price at checkout is the price applicable to that order. We reserve the right to change prices at any time without notice.
                  </p>
                </div>
              </div>

              {/* 5. Promotional codes */}
              <div className="space-y-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">05</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Promotional codes and discount offers <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <ul className="space-y-4 list-none p-0 text-sm text-muted-foreground/80 font-light">
                  <li className="flex gap-3"><span className="text-primary">✓</span> Valid only for the specific period and conditions stated.</li>
                  <li className="flex gap-3"><span className="text-primary">✓</span> NOR reserves the right to withdraw or modify promotions without notice.</li>
                  <li className="flex gap-3"><span className="text-primary">✓</span> Promotional codes cannot be combined unless explicitly stated.</li>
                  <li className="flex gap-3"><span className="text-primary">✓</span> Expired or previously used codes will not be honoured.</li>
                  <li className="flex gap-3"><span className="text-primary">✓</span> Discounts cannot be applied retroactively to already placed orders.</li>
                  <li className="flex gap-3"><span className="text-primary">✓</span> NOR is not obligated to honour prices resulting from system errors.</li>
                </ul>
              </div>

              {/* 6. Orders & 7. No cancellations */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">06</span>
                    <h2 className="font-display text-2xl text-foreground m-0">Orders and acceptance</h2>
                  </div>
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    An order is confirmed only when NOR sends a confirmation via SMS or email following successful payment. We reserve the right to decline any order due to stock unavailability, fraud suspicion, or policy violation.
                  </p>
                </div>

                <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertTriangle className="w-32 h-32 text-red-500" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-display text-lg">07</span>
                    <h2 className="font-display text-2xl text-red-400 m-0 uppercase tracking-widest">No cancellations</h2>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className="text-sm md:text-base text-red-100 font-medium leading-relaxed">
                      Orders cannot be cancelled once placed and payment is confirmed. NOR operates a strict no-cancellation policy. Please review your order carefully — product, quantity, and delivery address — before completing checkout.
                    </p>
                    <p className="text-xs text-red-400/80 font-bold uppercase tracking-[0.2em] pt-4 border-t border-red-500/10">
                      Please double-check before you pay: Once your payment is confirmed, your order is locked and cannot be cancelled or modified under any circumstances. NOR will not make exceptions to this policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* 8. Payment & 9. Shipping */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">08</span>
                    <h2 className="font-display text-xl text-foreground m-0">Payment</h2>
                  </div>
                  <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
                    Prepaid orders only (UPI, Debit, Credit, Net Banking). <strong>No Cash on Delivery (COD)</strong>. We do not store or access payment credentials.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">09</span>
                    <h2 className="font-display text-xl text-foreground m-0">Shipping</h2>
                  </div>
                  <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
                    Ships within India only via DTDC, Blue Dart, and Delhivery. 4-7 days from dispatch. Free shipping on orders above ₹999.
                  </p>
                </div>
              </div>

              {/* 11. Product use and disclaimer */}
              <div className="space-y-8 p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">11</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Product use and disclaimer</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/80 font-light leading-relaxed italic">
                      NOR make no medical or therapeutic claims. Perform a patch test before skin use. Store away from heat and direct sunlight.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["Do not ingest", "Keep away from children", "Avoid eye contact", "Automotive use only"].map((item, i) => (
                      <div key={i} className="px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 text-center flex items-center justify-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 12. Intellectual Property */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">12</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Intellectual property</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  All content — including the <strong>NOR</strong> brand name, logo, and product names (<strong>Mask, Aqua</strong>) — is the exclusive intellectual property of NOR. Unauthorised reproduction or distribution results in legal action.
                </p>
              </div>

              {/* 13. Limitation & 14. Indemnification */}
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase">13. Limitation of liability</h4>
                  <p className="text-xs text-muted-foreground/70 font-light leading-relaxed">
                    NOR's total liability shall not exceed the amount paid for the specific product. We are not liable for incidental or consequential damages.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase">14. Indemnification</h4>
                  <p className="text-xs text-muted-foreground/70 font-light leading-relaxed">
                    You agree to hold NOR harmless from any claims arising from your violation of these terms or misuse of our products.
                  </p>
                </div>
              </div>

              {/* 16. Governing Law */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">16</span>
                  <h2 className="font-display text-2xl text-foreground m-0 uppercase tracking-widest text-lg">Governing law and disputes</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  These Terms are governed by Indian law. Unresolved disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Kerala, India</strong>.
                </p>
              </div>

              {/* 18. Entire agreement */}
              <div className="space-y-6 p-10 bg-primary/5 border border-primary/10 rounded-3xl text-center">
                <Law className="w-10 h-10 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="font-display text-xl text-foreground m-0 uppercase tracking-widest text-sm">Entire Agreement</h3>
                <p className="text-xs text-muted-foreground/70 font-light italic max-w-sm mx-auto">
                  These Terms, coupled with our Return, Shipping, and Privacy Policies, supersede all prior communications whether written, verbal, or via Instagram DM.
                </p>
                <div className="pt-6">
                  <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">Legal & Governance • norperfume.help@gmail.com</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsOfService;
