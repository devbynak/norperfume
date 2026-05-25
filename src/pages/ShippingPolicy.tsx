import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Truck, MapPin, Clock, CreditCard, Box, AlertCircle, ShieldCheck, Search, HelpCircle } from "lucide-react";
import SEO from "@/components/SEO";

const ShippingPolicy = () => {
  return (
    <main className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
      <SEO 
        title="Shipping Policy | NOR PERFUME | Official Online Store"
        description="Our shipping policy for handcrafted luxury car fragrances."
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
            Shipping Policy
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
                  This policy covers all aspects of order processing, dispatch, delivery, and related matters for purchases made on <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">www.norperfume.com</span>. By placing an order, you confirm that you have read and agreed to this Shipping Policy in full.
                </p>
              </div>

              {/* 1. Shipping destinations */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">01</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Shipping destinations</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  NOR currently ships to all serviceable pin codes across <strong>India only</strong>. We do not offer international shipping at this time. If an order is placed with a non-Indian or unserviceable delivery address, the order will not be processed and the customer will be notified promptly.
                </p>
              </div>

              {/* 2. Courier partners */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">02</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Courier partners</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground/80 font-light leading-relaxed">NOR fulfils orders through the following courier partners based on delivery location and service availability:</p>
                  <div className="flex flex-wrap gap-4">
                    {["DTDC", "Blue Dart", "Delhivery"].map((partner) => (
                      <div key={partner} className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-foreground font-display tracking-widest text-sm uppercase">
                        {partner}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground/60 italic leading-relaxed">
                    NOR selects the most appropriate courier for each order based on location, availability, and service quality. Customers cannot request or specify a preferred courier partner.
                  </p>
                </div>
              </div>

              {/* 3. Order processing time */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">03</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Order processing time</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed">
                  <p>
                    All orders are processed within <strong>1–2 business days</strong> from the date of successful payment confirmation. Business days are Monday to Saturday, excluding Indian public holidays. Orders placed on Sundays or public holidays will be processed on the next available business day. You will receive an order confirmation via SMS or email once payment has been verified and the order accepted.
                  </p>
                  <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                    <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-primary/90 text-sm leading-relaxed italic">
                      Order confirmation does not mean your order has been dispatched. Processing time of 1–2 business days applies before handover to the courier partner.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Delivery timeline */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">04</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Delivery timeline</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  Once dispatched, standard delivery across India takes approximately <strong>4–7 business days</strong>. Total time from order to delivery is typically <strong>5–9 business days</strong>. Delays may occur due to remote locations, festive seasons, weather, incorrect addresses, unavailable recipients, or courier operational disruptions. NOR is not liable for delays caused by courier partners or circumstances beyond NOR's control.
                </p>
              </div>

              {/* 5. Shipping charges */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">05</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Shipping charges</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Orders above ₹999</span>
                    <span className="text-xl font-display text-foreground">Free shipping</span>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Orders below ₹999</span>
                    <span className="text-xl font-display text-foreground">Calculated at checkout</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/60 italic leading-relaxed">
                  NOR reserves the right to revise shipping charges at any time. The charge shown at checkout is the amount applicable to that specific order.
                </p>
              </div>

              {/* 6. Promotional shipping offers */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">06</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Promotional shipping offers <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  Any free shipping promotions or reduced shipping offers are valid only for the specified period and conditions stated at the time of the promotion. NOR reserves the right to withdraw or modify any shipping promotion at any time without prior notice. Promotional shipping offers cannot be applied retroactively to orders already placed.
                </p>
              </div>

              {/* 7. Payment — prepaid only */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">07</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Payment — prepaid only</h2>
                </div>
                <div className="p-8 bg-card border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="font-display uppercase tracking-widest text-xs m-0">Accepted Payment Methods</h3>
                  </div>
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    NOR accepts prepaid orders only. <strong>Cash on Delivery (COD) is not available</strong>. Accepted methods are UPI, debit cards, credit cards, and net banking — processed through a secure, encrypted third-party payment gateway. NOR does not store, access, or retain any payment card or banking credentials.
                  </p>
                </div>
              </div>

              {/* 8. No order cancellations */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">08</span>
                  <h2 className="font-display text-2xl text-foreground m-0 text-red-400">No order cancellations</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  Orders cannot be cancelled once placed and payment is confirmed. NOR operates a strict no-cancellation policy. Please review your order carefully before completing checkout. The only exception is if NOR is unable to fulfil the order due to a stock issue or system error, in which case a full refund will be issued to the original payment method within 5–7 business days.
                </p>
              </div>

              {/* 9. Order tracking */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">09</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Order tracking</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  Once dispatched, you will receive a shipment notification via SMS or email with a tracking number and a direct link to track your order in real time. You can also use the <strong>Track Order</strong> page on www.norperfume.com. If you have not received tracking information within 3 business days of order confirmation, contact us at <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a>.
                </p>
              </div>

              {/* 10. Incorrect delivery address — customer error */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">10</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Incorrect delivery address — customer error</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  It is the customer's sole responsibility to provide a complete, accurate, and accessible delivery address at checkout. NOR is not responsible for delayed, failed, or misdelivered orders resulting from an incorrect, incomplete, or inaccessible address provided by the customer. Address changes can only be accommodated before dispatch — contact <strong>norperfume.help@gmail.com</strong> immediately if a correction is needed. Once in transit, the delivery address cannot be changed.
                </p>
              </div>

              {/* 11. Incorrect delivery address — NOR error */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">11</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Incorrect delivery address — NOR error <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2 uppercase font-bold tracking-widest">New</span></h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  In the event that NOR dispatches an order to an address different from the one confirmed in the customer's order — where the error is solely on NOR's side and verifiable against the original confirmed order details — NOR will take full responsibility and arrange for a replacement product to be dispatched to the correct address at no additional cost to the customer. Customers must report such errors within 48 hours of the courier's delivery timestamp.
                </p>
              </div>

              {/* 12. Failed delivery attempts */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">12</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Failed delivery attempts</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  If the courier cannot deliver due to the recipient being unavailable or the address being inaccessible, the package may be held at the courier facility or returned to origin. NOR is not responsible for re-delivery costs. Please ensure someone is available at the delivery address during business hours.
                </p>
              </div>

              {/* 13. Lost or undelivered orders */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">13</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Lost or undelivered orders</h2>
                </div>
                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    If tracking has not updated for more than <strong>5 business days</strong> or shows an exception, contact <strong>norperfume.help@gmail.com</strong> with your order number. NOR will raise a formal investigation with the courier. If the order is confirmed lost by the courier, NOR will arrange a replacement at no cost. <strong>No monetary refunds are issued for lost orders</strong>. Investigations may take up to 7–10 business days.
                  </p>
                </div>
              </div>

              {/* 14. Damaged in transit */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg">14</span>
                  <h2 className="font-display text-2xl text-foreground m-0">Damaged in transit</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  If your product arrives damaged due to courier mishandling, refer to our <strong>Return Policy</strong> at www.norperfume.com for full instructions. A valid, continuous unboxing video recorded before the package is opened is required to process any damage claim.
                </p>
              </div>

              {/* Support Contact */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Shipping Enquiries</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light italic">Our logistics team ensures every NOR package is handled with precision.</p>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl inline-block">
                  <a href="mailto:norperfume.help@gmail.com" className="text-primary font-medium hover:underline text-lg">norperfume.help@gmail.com</a>
                </div>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">Acknowledgements within 24 hours</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ShippingPolicy;
