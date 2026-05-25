import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Send, X, Loader2, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";
import { trackContact } from "@/lib/meta-pixel";

const contactInfo = [
  {
    icon: Mail,
    label: "Support",
    value: "support@norperfume.com",
    href: "mailto:support@norperfume.com"
  },
  {
    icon: Mail,
    label: "Business",
    value: "business@norperfume.com",
    href: "mailto:business@norperfume.com"
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Sat: 9am - 7pm",
    href: null
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    queryType: "General Inquiry",
    subject: "",
    message: "",
  });
  const form = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await emailjs.sendForm(
        'service_iir7u3h',
        'template_lfl0xrf',
        e.currentTarget as HTMLFormElement,
        'F_puGs2xOh1E7o8_D'
      );

      setShowSuccess(true);
      setFormData({ name: "", email: "", queryType: "General Inquiry", subject: "", message: "" });
      trackContact();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/20">
      <SEO
        title="Contact Us | NOR PERFUME | Official Online Store"
        description="Get in touch with the NOR team for order inquiries, damage claims, or product questions. We respond to all messages within 24 hours."
      />
      <Navbar />

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Subtle background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/[0.02] blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto">
          {/* Minimal Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <h1 className="font-display text-4xl md:text-6xl mb-6 tracking-tight">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed opacity-80">
              For inquiries regarding orders, products, or collaborations, please use the form below.
            </p>
          </motion.div>

          {/* Minimal Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="glass-card rounded-3xl p-6 md:p-10 border-white/[0.05]">
              <form ref={form} className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">Name</label>
                    <Input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-primary/40 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-primary/40 text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-queryType" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">Inquiry Type</label>
                    <div className="relative">
                      <select
                        id="contact-queryType"
                        name="queryType"
                        value={formData.queryType}
                        onChange={handleChange}
                        className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-sm text-foreground focus:border-primary/40 appearance-none cursor-pointer outline-none transition-colors"
                      >
                        <option value="General Inquiry" className="bg-background">General Inquiry</option>
                        <option value="Order Status" className="bg-background">Order Status</option>
                        <option value="Product Feedback" className="bg-background">Product Feedback</option>
                        <option value="Wholesale/B2B" className="bg-background">Wholesale/B2B</option>
                        <option value="Other" className="bg-background">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject</label>
                    <Input
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Topic"
                      className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-primary/40 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-base text-foreground focus:outline-none focus:border-primary/40 resize-none transition-colors min-h-[120px]"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs text-center animate-in fade-in slide-in-from-top-1">{error}</p>
                )}

                <Button
                  disabled={isLoading}
                  className="w-full gradient-gold text-primary-foreground font-bold tracking-widest text-[11px] h-12 rounded-full uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Minimal Contact Info Grid */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] mb-4 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-4 h-4 text-primary opacity-70 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-xs md:text-sm hover:text-primary transition-colors block truncate">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-xs md:text-sm">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-white/10 p-10 rounded-[2rem] max-w-sm w-full shadow-2xl text-center glass-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-2">Message Sent</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Thank you for reaching out. We'll get back to you shortly.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-white text-black font-bold tracking-widest text-[10px] h-11 rounded-full uppercase hover:bg-white/90"
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default Contact;
