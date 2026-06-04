import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptics";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle2, MapPin, Clock, ExternalLink } from "lucide-react";
import React, { useState } from "react";

interface ShiprocketData {
  tracking_data?: {
    shipment_track?: Array<{
      courier_name?: string;
      awb_code?: string;
      expected_date?: string;
      weight?: string | number;
      destination?: string;
      current_status?: string;
      current_location?: string;
    }>;
  };
}

interface TrackingHistory {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("In Processing");
  const [edd, setEdd] = useState("Pending");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [milestones, setMilestones] = useState<any[]>([]);
  const [history, setHistory] = useState<TrackingHistory[]>([]);
  const [rawTrackingData, setRawTrackingData] = useState<ShiprocketData | null>(null);
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
      setCourierName(data.courierName);
      setTrackingNumber(data.trackingNumber);
      setCurrentLocation(data.location);
      setMilestones(data.milestones || []);
      setHistory(data.history || []);
      setRawTrackingData(data.rawData); 
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
                    <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-1">Current Status</p>
                        <h3 className="text-3xl font-display text-foreground">{currentStatus}</h3>
                        <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                           <MapPin className="w-3 h-3" /> {currentLocation}
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">Estimated Delivery</p>
                        <h3 className="text-2xl font-display text-foreground">{edd}</h3>
                      </div>
                    </div>

                    {/* Road Map Milestone Tracker */}
                    <div className="bg-card/20 border border-border/30 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 relative">
                        {milestones.length > 0 ? milestones.map((milestone, idx) => (
                          <React.Fragment key={milestone.id}>
                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1 relative z-10">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                                milestone.completed 
                                  ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                                  : 'bg-background border-border/50 text-muted-foreground'
                              }`}>
                                {milestone.id === 'ordered' && <Package className="w-5 h-5" />}
                                {milestone.id === 'shipped' && <Truck className="w-5 h-5" />}
                                {milestone.id === 'out_for_delivery' && <MapPin className="w-5 h-5" />}
                                {milestone.id === 'delivered' && <CheckCircle2 className="w-5 h-5" />}
                              </div>
                              <div className="text-left md:text-center">
                                <p className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-500 ${
                                  milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {milestone.label}
                                </p>
                                {milestone.completed && idx === milestones.filter(m => m.completed).length - 1 && (
                                  <span className="inline-block md:block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-[9px] text-primary font-black uppercase tracking-tighter animate-pulse">
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                            {idx < milestones.length - 1 && (
                              <div className="hidden md:block flex-[0.5] h-[2px] relative top-[-15px]">
                                <div className="absolute inset-0 bg-border/20 rounded-full" />
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: milestone.completed && milestones[idx+1].completed ? '100%' : '0%' }}
                                  className="absolute inset-0 bg-primary rounded-full"
                                />
                              </div>
                            )}
                            {idx < milestones.length - 1 && (
                              <div className="md:hidden w-[2px] h-8 ml-[23px] bg-border/20 relative">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: milestone.completed && milestones[idx+1].completed ? '100%' : '0%' }}
                                  className="absolute inset-0 bg-primary w-full"
                                />
                              </div>
                            )}
                          </React.Fragment>
                        )) : (
                          <div className="w-full text-center py-4">
                            <p className="text-muted-foreground text-xs italic">Calculating shipment milestones...</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipment Summary Card */}
                    <div className="bg-card/20 border border-border/30 rounded-[32px] p-8 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Truck className="w-32 h-32 text-primary" />
                      </div>
                      <h4 className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-8 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Shipment Summary
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Tracking Number</p>
                          <p className="text-sm font-semibold text-foreground tracking-wider">{trackingNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Delivery Partner</p>
                          <p className="text-sm font-semibold text-foreground">{courierName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Destination</p>
                          <p className="text-sm font-semibold text-foreground">{rawTrackingData?.tracking_data?.shipment_track?.[0]?.destination || "India"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking History */}
                    <div className="bg-card/10 border border-border/20 rounded-[32px] p-8 md:p-10">
                      <h4 className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-10 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Tracking History
                      </h4>
                      
                      <div className="space-y-10 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/30" />
                        
                        {history.length > 0 ? history.map((item, idx) => (
                          <div key={idx} className="flex gap-8 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 z-10 ${
                              idx === 0 ? 'bg-primary border-primary' : 'bg-background border-border/50'
                            }`}>
                              {idx === 0 ? (
                                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-border/50" />
                              )}
                            </div>
                            
                            <div className="flex-1 pb-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h5 className={`font-semibold text-base tracking-tight ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {item.status}
                                </h5>
                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] font-bold text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {new Date(item.timestamp).toLocaleDateString("en-IN", { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                  <span className="text-[11px] font-bold text-primary/70 bg-primary/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {new Date(item.timestamp).toLocaleTimeString("en-IN", { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 italic">
                                <MapPin className="w-3 h-3 opacity-50" /> {item.location}
                              </p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-10">
                             <p className="text-muted-foreground text-sm italic">Waiting for carrier updates...</p>
                          </div>
                        )}
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
