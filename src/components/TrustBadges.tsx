import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, label: "All India Shipping" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Headphones, label: "24/7 Support" },
];

const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto py-8 px-4">
    {badges.map(({ icon: Icon, label }) => (
      <div key={label} className="flex flex-col items-center gap-2 text-center">
        <Icon className="w-6 h-6 text-primary" />
        <span className="text-xs tracking-wide uppercase text-muted-foreground">{label}</span>
      </div>
    ))}
  </div>
);

export default TrustBadges;
