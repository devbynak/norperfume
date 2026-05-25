import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, Camera, Truck, History, MessageSquare, PackageX, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const RefundPolicy = () => {
  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
      <SEO 
        title="Return & Refund Policy | NOR PERFUME | Official Online Store"
        description="Our policy regarding returns and refunds for our luxury car fragrances."
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
            Return Policy
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
            
            <div className="flex items-center gap-3 mb-12 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-emerald-500/90 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">✓ All audit gaps fixed — fully refined version</p>
            </div>

            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-16">
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg font-light italic">
                  This policy applies to all purchases made on <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">www.norperfume.com</span>. By placing an order with NOR, you confirm that you have read, understood, and agreed to this Return Policy in full. Please read carefully before purchasing.
                </p>
              </div>

              {/* 1. General policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">01</span>
                  <h2 className="font-display text-2xl text-foreground m-0">General policy</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed">
                  <p>
                    Due to the nature of fragrance and personal care products, NOR does not accept returns, exchanges, or cancellations once an order has been placed or a product has been delivered and opened. All sales are considered final from the moment an order is confirmed and payment is received.
                  </p>
                  <p>
                    We strongly encourage all customers to read product descriptions, scent profiles, and all available information carefully before placing an order. Fragrance preference is personal and subjective — NOR does not accept returns based on scent preference, change of mind, or personal dissatisfaction with the fragrance under any circumstances.
                  </p>
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-500/90 text-sm leading-relaxed">
                      <strong className="block text-red-500 uppercase tracking-widest text-[10px] mb-1">No cancellations:</strong>
                      Orders cannot be cancelled once placed and payment is confirmed. Please review your order carefully before completing payment. NOR will not cancel, modify, or refund any order on the basis of a customer change of mind after payment is confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Important — start recording */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">02</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Important — start recording before you unbox</h2>
                </div>
                <div className="space-y-6 text-muted-foreground/80 font-light leading-relaxed">
                  <p>
                    NOR strongly advises every customer to begin video recording on their phone before touching or opening their delivery package. This is for your own protection and is the only way NOR can verify and process a legitimate damage claim.
                  </p>
                  <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Camera className="w-32 h-32" />
                    </div>
                    <h3 className="text-primary font-display uppercase tracking-widest text-[10px] m-0 font-bold">Our advice to every customer</h3>
                    <p className="text-sm md:text-base leading-relaxed relative z-10 text-foreground italic">
                      "The moment your NOR order arrives — before you open or touch the package — start recording a clear, continuous video on your phone. Keep recording through the entire unboxing process without stopping or cutting. If your product has been damaged during shipping, this video is your proof. Without it, NOR cannot process your claim. This video protects you as the customer and helps NOR resolve genuine shipping damage quickly and fairly."
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Definition of damage */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">03</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Definition of damage <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <div className="space-y-6 text-muted-foreground/80 font-light leading-relaxed">
                  <p>For the purpose of this policy, "damage" is strictly defined as physical damage to the product itself that renders it unusable. Specifically, damage means:</p>
                  <ul className="grid md:grid-cols-3 gap-4 list-none p-0 m-0">
                    {["A cracked or completely broken perfume bottle", "A non-functional or broken spray mechanism", "Significant leakage of the fragrance due to breakage"].map((item, i) => (
                      <li key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs flex gap-3 italic">
                        <span className="text-primary text-lg leading-none mt-1">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <p className="font-medium text-foreground">The following do not constitute damage and are not eligible for a claim:</p>
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 list-none p-0 text-[11px] opacity-60">
                    <li>• Minor dents or scuffs on outer packaging</li>
                    <li>• Cosmetic imperfections on the bottle or tag</li>
                    <li>• Slight variation in packaging batches</li>
                    <li>• Normal condensation or surface scratches on box</li>
                  </ul>
                  <div className="p-4 border-l-2 border-primary/30 bg-primary/[0.02] text-xs">
                    <p><strong>Important:</strong> Only damage to the product itself — as defined above — qualifies for a claim. Outer packaging imperfections alone do not qualify. NOR's decision on whether damage meets the definition above is final.</p>
                  </div>
                </div>
              </div>

              {/* 4. Eligible claims */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">04</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Eligible claims — shipping damage only</h2>
                </div>
                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl italic font-light text-muted-foreground/80 leading-relaxed">
                  NOR will only consider a claim under the following circumstance: The product itself was physically damaged during shipping by the courier (DTDC, Blue Dart, or Delhivery). No monetary refund will be issued under any circumstances.
                </div>
              </div>

              {/* 5. Mandatory requirements */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">05</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Mandatory requirements for a damage claim</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { id: "01 — Unboxing video", text: "A continuous, unedited video that begins before the outer package is touched. Must show the full exterior from all sides. Edited/cut/stitched videos will not be accepted." },
                    { id: "02 — Photographs", text: "Clear, well-lit photographs from multiple angles of the product and the impacted outer packaging boxes." },
                    { id: "03 — Order details", text: "Full name, order number, registered phone/email, and the exact date/timestamp of delivery." },
                    { id: "04 — 48-hour window", text: "Claim must be submitted within 48 hours of courier delivery. Claims after this window will not be reviewed." }
                  ].map((step, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2">{step.id}</h4>
                      <p className="text-sm text-muted-foreground/90 font-light leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <p className="text-xs text-amber-500/80 leading-relaxed italic">
                    <strong>Zero exceptions policy:</strong> If any requirement is missing or does not meet standards — including a partial or post-opening video — NOR reserves the right to reject the claim entirely.
                  </p>
                </div>
              </div>

              {/* 6. Non-receipt claims */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">06</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Non-receipt claims <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>If an order is marked as delivered but you haven't received it, report it within 48 hours. NOR will raise an investigation with the courier (DTDC, Blue Dart, or Delhivery) allowing up to 7 business days for response.</p>
                  <p>NOR reserves the right to request a valid photo ID and a signed declaration of non-receipt. If courier investigation confirms successful delivery to the correct address, NOR is not obligated to provide a replacement.</p>
                  <div className="p-4 border-l-2 border-primary/30 bg-primary/[0.02] text-[11px] uppercase tracking-widest font-bold">
                    Fraud prevention: false non-receipt claims will lead to a permanent ban and reporting to authorities.
                  </div>
                </div>
              </div>

              {/* 7. Repeat claims */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">07</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Repeat and suspicious claims <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  NOR reserves the right to decline or limit claims from customers who have previously submitted damage or non-receipt claims. Customers who submit repeated, escalating, or suspicious claims may be flagged and refused future service at NOR's sole discretion.
                </p>
              </div>

              {/* 8 & 9 */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-foreground m-0">08. How to submit</h3>
                  <p className="text-xs text-muted-foreground/70 font-light leading-relaxed">
                    Contact us at <a href="mailto:support@norperfume.com" className="text-primary underline">support@norperfume.com</a> or via Instagram <span className="text-foreground font-medium">@norperfumeofficial</span> with your unboxing video, photos, and order ID.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-foreground m-0">09. Wrong product</h3>
                  <p className="text-xs text-muted-foreground/70 font-light leading-relaxed">
                    Contact us within 48 hours with your order number and a clear photo of the product received. We will verify and arrange the correct item at no extra charge.
                  </p>
                </div>
              </div>

              {/* 10. Situations not covered */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">010</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Situations not covered</h2>
                </div>
                <ul className="grid md:grid-cols-2 gap-4 list-none p-0 text-[11px] text-muted-foreground font-light leading-relaxed italic">
                  {[
                    "Change of mind or personal dissatisfaction",
                    "Order cancellations after confirmation",
                    "Damage caused by customer after delivery",
                    "Damage caused by improper storage or misuse",
                    "Damage caused during unboxing process",
                    "Minor cosmetic outer packaging scuffs",
                    "Opened, used or partially consumed products",
                    "Products returned without prior approval",
                    "Claims after the 48-hour window",
                    "Claims without valid, continuous unboxing video",
                    "Claims with edited or stitched videos",
                    "Normal fragrance fading over time",
                    "Non-receipt where courier confirms delivery",
                    "Suspicious or repeated claim behaviour"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-500/40 shrink-0 select-none">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 11 & 12 */}
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h3 className="font-display text-2xl text-foreground m-0">Replacement only — no refunds</h3>
                  <p className="text-sm text-muted-foreground/60 font-light italic max-w-xl mx-auto">
                    NOR does not offer monetary refunds under any circumstances, including for verified damage. In all eligible cases, NOR will provide a replacement product only.
                  </p>
                </div>
                <div className="p-8 bg-card/60 border border-white/5 rounded-3xl text-center space-y-4">
                  <PackageX className="w-10 h-10 text-primary/40 mx-auto" />
                  <h4 className="font-display text-lg text-foreground m-0">Unauthorised returns</h4>
                  <p className="text-xs text-muted-foreground/70 font-light leading-relaxed max-w-md mx-auto">
                    Any product physically returned to NOR without prior written approval will not be accepted, processed, or eligible for replacement. NOR bears no responsibility for shipping costs, losses, or damage related to unauthorised returns.
                  </p>
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

export default RefundPolicy;
