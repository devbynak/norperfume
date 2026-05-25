import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptics";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle2, Search, MapPin, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";

const trackingSteps = [
  { status: "Ordered", date: "Oct 12", desc: "Order confirmed and being prepared", completed: true, current: false },
  { status: "Processing", date: "Oct 13", desc: "Quality check and premium packaging", completed: true, current: true },
  { status: "Shipped", date: "Expected Oct 14", desc: "Handed over to our luxury courier partner", completed: false, current: false },
  { status: "Delivered", date: "Expected Oct 16", desc: "Arriving at your doorstep", completed: false, current: false },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("In Processing");
  const [edd, setEdd] = useState("Oct 16, 2026");
  const [liveSteps, setLiveSteps] = useState<any[]>(trackingSteps);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMsg("");

    try {
      const cleanAwb = orderId.replace(/#/g, "").trim();
      const res = await fetch(`/api/track?awb=${encodeURIComponent(cleanAwb)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        haptic("warning");
        throw new Error(data.error || "Unable to find shipping status.");
      }

      haptic("success");
      setCurrentStatus(data.status);
      setEdd(data.edd);
      setLiveSteps(data.steps);
      setShowResult(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to retrieve tracking details.");
      setShowResult(false);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-dvh bg-background">
      <SEO 
        title="Track My Order | NOR PERFUME | Official Online Store"
        description="Track your luxury car fragrance order in real-time."
      />
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20"
          >
            <Truck className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Track Your Journey
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-muted-foreground text-[16px] max-w-lg mx-auto leading-relaxed"
          >
            Enter your details below to follow your NOR fragrance from our studio to your car.
          </motion.p>
        </div>
      </section>

      <section className="pb-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Tracking Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 bg-card/30 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 md:p-10 shadow-2xl lg:sticky lg:top-32"
            >
              <h2 className="text-xl font-display text-foreground mb-8">Order Details</h2>
              <form onSubmit={handleTrack} className="space-y-6">
                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl font-medium tracking-wide">
                    {errorMsg}
                  </p>
                )}
                <div className="space-y-2">
                  <label htmlFor="order-id" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Order Number</label>
                  <Input 
                    id="order-id"
                    name="orderId"
                    placeholder="e.g. #NOR12345" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="bg-background/50 border-border/50 h-14 focus:border-primary/50 text-white rounded-2xl"
                  />
                </div>
                <Button 
                  onClick={() => haptic("medium")}
                  disabled={isSearching}
                  className="w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  {isSearching ? "Searching..." : "Track My Order"}
                </Button>
              </form>
              
              <div className="mt-10 pt-8 border-t border-border/30">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Need help?</p>
                    <p className="text-[11px]">Contact us for support inquiries.</p>
                  </div>
                  <a href="/contact" className="ml-auto p-2 hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Results / Timeline View */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] border-2 border-dashed border-border/30 rounded-[40px] flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                      <Package className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-foreground/40 font-display text-2xl mb-2">No active search</h3>
                    <p className="text-muted-foreground/30 text-sm max-w-xs">
                      Enter your order details to view live shipping status and history.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Status Header */}
                    <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex items-center justify-between gap-6">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-1">Current Status</p>
                        <h3 className="text-2xl font-display text-foreground">{currentStatus}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">Estimated Delivery</p>
                        <h3 className="text-xl font-display text-foreground">{edd}</h3>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-card/20 border border-border/30 rounded-[40px] p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Truck className="w-40 h-40 text-primary" />
                      </div>
                      
                      <div className="space-y-12 relative">
                        {liveSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${
                                step.completed ? 'bg-primary border-primary' : 
                                step.current ? 'bg-primary/10 border-primary' : 'bg-transparent border-border'
                              }`}>
                                {step.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                ) : (
                                  <div className={`w-2 h-2 rounded-full ${step.current ? 'bg-primary animate-pulse' : 'bg-border'}`} />
                                )}
                              </div>
                              {idx !== liveSteps.length - 1 && (
                                <div className={`w-0.5 h-12 my-2 rounded-full transition-colors duration-500 ${step.completed ? 'bg-primary' : 'bg-border/30'}`} />
                              )}
                            </div>
                            <div className="pt-1 flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-semibold text-lg transition-colors ${step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {step.status}
                                </h4>
                                <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md">{step.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                {step.desc}
                              </p>
                              {step.current && (
                                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-primary bg-primary/5 w-max px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                                   <MapPin className="w-3 h-3" /> KOCHI STUDIO, KERALA
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Support Banner */}
                    <div className="bg-muted/10 border border-border/50 rounded-[32px] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
                       <div className="flex -space-x-3 overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover" />
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover" />
                       </div>
                       <div className="flex-1">
                         <p className="text-sm text-muted-foreground">Our support team is live and ready to help if you have questions about your delivery.</p>
                       </div>
                       <Button variant="outline" className="rounded-full px-6 border-white/10 hover:bg-white/5">
                         Live Chat
                       </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TrackOrder;
