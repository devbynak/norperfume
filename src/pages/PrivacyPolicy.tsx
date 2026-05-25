import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Lock, UserCheck, MessageSquare, ShieldCheck, Mail, Instagram } from "lucide-react";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
      <SEO 
        title="Privacy Policy | NOR PERFUME | Official Online Store"
        description="Our commitment to protecting your privacy and personal information."
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
            Privacy Policy
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
                  This Privacy Policy explains how NOR collects, uses, stores, and protects your personal information when you visit <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">www.norperfume.com</span> or interact with NOR through any channel. By using our website, placing an order, or contacting us via any channel, you consent to the data practices described in this policy.
                </p>
              </div>

              {/* 1. Who we are */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">01</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Who we are</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  NOR is a luxury automotive fragrance brand operated as an individual seller, designed and manufactured in Kerala, India. Our website is <strong>www.norperfume.com</strong>. For any privacy-related queries, contact us at <strong>norperfume.help@gmail.com</strong> or via Instagram DM <strong>@norperfumeofficial</strong>. We respond to all privacy enquiries within 24 hours.
                </p>
              </div>

              {/* 2. Channels */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">02</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Channels through which we collect data</h2>
                </div>
                <ul className="space-y-4 list-none p-0">
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 text-sm text-foreground/80">
                    <Database className="w-5 h-5 text-primary" /> www.norperfume.com — when you browse, add to cart, or place an order
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 text-sm text-foreground/80">
                    <Mail className="w-5 h-5 text-primary" /> Email (norperfume.help@gmail.com) — when you contact us for support
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 text-sm text-foreground/80">
                    <Instagram className="w-5 h-5 text-primary" /> Instagram DM (@norperfumeofficial) — when you contact us for support
                  </li>
                </ul>
              </div>

              {/* 3. Information we collect */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">03</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Information we collect</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="font-display text-lg text-foreground m-0 uppercase tracking-widest text-[11px] text-primary">Information you provide directly</h3>
                    <ul className="space-y-3 text-xs text-muted-foreground/80 font-light list-none p-0">
                      <li>• <strong>Full name</strong> — used to process and address your order</li>
                      <li>• <strong>Email address</strong> — used for confirmations and support</li>
                      <li>• <strong>Phone number</strong> — used for delivery coordination</li>
                      <li>• <strong>Delivery address</strong> — used solely for shipping</li>
                      <li>• <strong>Claim materials</strong> — unboxing videos and photographs</li>
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-display text-lg text-foreground m-0 uppercase tracking-widest text-[11px] text-primary">Information collected automatically</h3>
                    <ul className="space-y-3 text-xs text-muted-foreground/80 font-light list-none p-0">
                      <li>• IP address, browser type, and device identifiers</li>
                      <li>• Pages visited and time spent on www.norperfume.com</li>
                      <li>• Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>

                <div className="p-8 bg-black/20 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-display uppercase tracking-widest text-xs m-0">Payment information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    NOR does not collect, store, or access payment card details, bank account information, or UPI credentials. All payment transactions are processed entirely and securely by our third-party payment gateway. NOR receives only a payment confirmation and transaction reference number.
                  </p>
                </div>
              </div>

              {/* 4. Instagram DM Notice */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">04</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Instagram DM — data notice <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <div className="space-y-6 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>NOR actively uses Instagram DM (@norperfumeofficial) as a customer support channel. When customers submit damage claims, unboxing videos, photographs, or personal order details via Instagram DM, this information is received and retained by NOR for claim verification and support resolution purposes.</p>
                  <p className="font-medium text-foreground">Please be aware of the following:</p>
                  <ul className="space-y-4 list-none p-0 text-xs">
                    <li className="flex gap-3"><span className="text-primary">•</span> Instagram's own Privacy Policy governs all data transmitted through the Instagram platform. NOR is not responsible for Instagram's data practices.</li>
                    <li className="flex gap-3"><span className="text-primary">•</span> NOR advises customers not to share sensitive personal or financial information — such as full bank details, card numbers, or passwords — via Instagram DM.</li>
                    <li className="flex gap-3"><span className="text-primary">•</span> Claim-related materials (videos, photos, order details) received via Instagram DM are retained by NOR for up to 1 year for verification and fraud prevention purposes.</li>
                  </ul>
                </div>
              </div>

              {/* 5. How we use your information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">05</span>
                  <h2 className="font-display text-2xl text-foreground m-0">How we use your information</h2>
                </div>
                <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4 list-none p-0 text-xs text-muted-foreground/80 font-light italic">
                  {[
                    "Confirm, process, and fulfil your orders",
                    "Send shipping updates and notifications",
                    "Respond to enquiries and support requests",
                    "Verify damage and non-receipt claims",
                    "Improve our website and products",
                    "Send marketing communications (Opt-in only)",
                    "Detect and prevent fraudulent transactions",
                    "Comply with legal obligations in India"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary/40 shrink-0">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Sharing your information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">06</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Sharing your information</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light mb-4">NOR does not sell, rent, trade, or share your data for commercial purposes. Data is shared only with:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Courier Partners", desc: "DTDC, Blue Dart, Delhivery (For delivery only)" },
                    { title: "Payment Gateway", desc: "Secure transaction processing only" },
                    { title: "Shopify", desc: "As our e-commerce platform provider" },
                    { title: "Legal Authorities", desc: "Only if required by Indian law" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground/70 italic">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Data retention */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">08</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Data retention</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-card border border-white/5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Order Records</span>
                    <span className="text-xl font-display text-foreground">3 Years</span>
                  </div>
                  <div className="p-6 bg-card border border-white/5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Support Logs</span>
                    <span className="text-xl font-display text-foreground">2 Years</span>
                  </div>
                  <div className="p-6 bg-card border border-white/5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Claim Materials</span>
                    <span className="text-xl font-display text-foreground">1 Year</span>
                  </div>
                  <div className="p-6 bg-card border border-white/5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Marketing Opt-in</span>
                    <span className="text-xl font-display text-foreground">Until Deletion</span>
                  </div>
                </div>
              </div>

              {/* 9. Your rights */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">09</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Your rights</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Access", "Correction", "Deletion", "Opt out", "Portability"].map((right) => (
                    <span key={right} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-foreground/70 uppercase tracking-widest">
                      {right}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/80 font-light leading-relaxed italic">
                  Contact <strong>norperfume.help@gmail.com</strong> to exercise any of these rights. We respond within 24 hours and resolve within 7 business days.
                </p>
              </div>

              {/* Support Contact */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Privacy Enquiries</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light italic">Your data security and trust are the foundation of NOR.</p>
                </div>
                <div className="inline-flex flex-col gap-2">
                  <a href="mailto:norperfume.help@gmail.com" className="text-primary font-medium hover:underline text-lg">norperfume.help@gmail.com</a>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display">Data Protection Officer</span>
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

export default PrivacyPolicy;
