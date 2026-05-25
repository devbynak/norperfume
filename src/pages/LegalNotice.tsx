import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, FileText, XCircle, Video, Ban, AlertTriangle, UserX, Gavel, Mail, Instagram, Globe } from "lucide-react";
import SEO from "@/components/SEO";

const LegalNotice = () => {
  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
      <SEO 
        title="Legal Notice | NOR PERFUME | Official Online Store"
        description="Official company information and legal disclosures for NOR Perfume."
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
            Legal Notice
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
              <p className="text-emerald-500/90 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">✓ Official policy document — fully updated version</p>
            </div>

            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-16">
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg font-light italic">
                  This legal notice governs all purchases and interactions on <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">www.norperfume.com</span>. By placing an order or using this website, you confirm that you have read, understood, and agreed to the terms below.
                </p>
              </div>

              {/* 01. Brand Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">01</span>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Brand Identity</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  NOR Perfume is a luxury automotive fragrance brand designed and manufactured in Kerala, India, operated as an individual seller. Products are sold exclusively via <strong>www.norperfume.com</strong>.
                </p>
              </div>

              {/* 02. Intellectual Property */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">02</span>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Intellectual Property</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  All content on this website — including the brand name, logo, product names, imagery, copy, and design — is the exclusive property of NOR Perfume and is protected under applicable intellectual property laws. Unauthorized reproduction, distribution, or use may result in legal action.
                </p>
              </div>

              {/* 03. No Refund Policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">03</span>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <h2 className="font-display text-2xl text-foreground m-0">No Refund Policy</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  All sales are final. NOR follows a strict no-refund policy. Monetary refunds will not be issued under any circumstances, including dissatisfaction with scent or product, shipping delays, or personal preference. Fragrance preference is subjective and is not a valid reason for return or refund.
                </p>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm font-light leading-relaxed">
                  Valid claims (shipping damage, wrong product, non-receipt) are resolved through <strong>replacement only</strong>, subject to verification and approval by NOR.
                </div>
              </div>

              {/* 04. Claim Conditions */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">04</span>
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Claim Conditions</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  Damage or delivery claims are subject to the following conditions:
                </p>
                <ul className="space-y-4 list-none p-0">
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-foreground/80 leading-relaxed font-light">
                    • An unboxing video must be recorded continuously before the package is opened.
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-foreground/80 leading-relaxed font-light">
                    • The video must show all sides of the sealed package and the full unboxing process without interruption.
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-foreground/80 leading-relaxed font-light">
                    • Clear photographs of the product and packaging must be provided.
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-foreground/80 leading-relaxed font-light">
                    • Full order details (name, order number, contact, delivery timestamp) must be included.
                  </li>
                  <li className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-foreground/80 leading-relaxed font-light">
                    • All claims must be submitted within 48 hours of delivery.
                  </li>
                </ul>
                <p className="text-destructive text-sm font-semibold italic">
                  Incomplete, edited, or delayed submissions will be rejected without review. NOR's determination of damage is final.
                </p>
              </div>

              {/* 05. What is Not Covered */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">05</span>
                  <div className="flex items-center gap-2">
                    <Ban className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">What is Not Covered</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  The following are not eligible for replacement or any other remedy:
                </p>
                <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4 list-none p-0 text-sm text-muted-foreground/80 font-light italic">
                  {[
                    "Change of mind or dissatisfaction with scent",
                    "Order cancellations after payment is confirmed",
                    "Customer-caused damage or mishandling",
                    "Minor cosmetic packaging imperfections",
                    "Opened or used products",
                    "Claims submitted after 48 hours",
                    "Missing, edited, or incomplete proof"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-destructive shrink-0">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 06. Limitation of Liability */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">06</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Limitation of Liability</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  To the maximum extent permitted by applicable law, NOR is not liable for indirect, incidental, or consequential damages arising from the use or inability to use our products or website. Total liability is strictly limited to the amount paid for the specific product in question.
                </p>
              </div>

              {/* 07. Fraud and Misuse */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">07</span>
                  <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Fraud and Misuse</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  NOR reserves the right to refuse service, restrict or permanently ban accounts, and initiate legal proceedings against customers engaging in fraudulent activity, false claims, or misuse of any NOR policy.
                </p>
              </div>

              {/* 08. Governing Law and Jurisdiction */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">08</span>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Governing Law & Jurisdiction</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  These terms are governed by the laws of India. All disputes shall first be attempted to be resolved amicably. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in Kerala, India.
                </p>
                
                <div className="p-6 bg-black/20 border border-white/5 rounded-3xl space-y-4">
                  <h3 className="font-display uppercase tracking-widest text-[11px] text-primary m-0">This notice aligns with:</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground/80 font-light list-none p-0">
                    <li>• Consumer Protection Act, 2019</li>
                    <li>• Consumer Protection (E-Commerce) Rules, 2020</li>
                    <li>• Information Technology Act, 2000</li>
                    <li>• Federal Decree Law No. 15 of 2020 on Consumer Protection (UAE)</li>
                    <li>• Federal Decree Law No. 45 of 2021 on Personal Data Protection (UAE)</li>
                  </ul>
                </div>
              </div>

              {/* 09. Statutory Rights */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">09</span>
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl text-foreground m-0">Statutory Rights</h2>
                  </div>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  Nothing in this notice overrides statutory consumer rights under applicable law. Where legally mandated, NOR will provide the required remedy, which may include replacement, repair, or refund.
                </p>
              </div>

              {/* Support Contact */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Legal Contacts</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light italic">Response time: Within 48 hours | Jurisdiction: Kerala, India</p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-6">
                  <a href="mailto:norperfume.help@gmail.com" className="flex items-center gap-2 text-primary font-medium hover:underline text-base">
                    <Mail className="w-4 h-4" /> norperfume.help@gmail.com
                  </a>
                  <a href="https://instagram.com/norperfumeofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-medium hover:underline text-base">
                    <Instagram className="w-4 h-4" /> @norperfumeofficial
                  </a>
                  <a href="https://www.norperfume.com" className="flex items-center gap-2 text-primary font-medium hover:underline text-base">
                    <Globe className="w-4 h-4" /> www.norperfume.com
                  </a>
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

export default LegalNotice;
