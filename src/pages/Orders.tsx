import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Package2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerOrders, type CustomerOrder } from "@/lib/shopify/customer-queries";

function formatMoney(amount?: string, currency?: string) {
  if (!amount) return "—";
  const n = Number(amount);
  if (!Number.isFinite(n)) return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

function statusPill(label?: string) {
  if (!label) return null;
  const tone =
    /paid|fulfilled|delivered|success/i.test(label)
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : /refund|cancel|void/i.test(label)
      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
      : "bg-amber-500/15 text-amber-300 border-amber-500/30";
  return (
    <span
      className={`inline-flex items-center text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${tone}`}
    >
      {label.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

const Orders = () => {
  const { isAuthenticated, login } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      login("/orders");
      return;
    }
    fetchCustomerOrders(25)
      .then(setOrders)
      .catch((e) => {
        setError("Unable to load orders at this time.");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, login]);

  if (!isAuthenticated || loading) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SEO 
        title="My Orders | NOR PERFUME | Official Online Store"
        description="View your order history and tracking status."
      />
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-24">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to account
        </Link>
        <header className="mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Order history
          </p>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight">Your orders</h1>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="p-10 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
            <Package2 className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-base mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              When you place an order it will show up here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const tracking = order.fulfillments?.nodes?.flatMap(
                (f) => f.trackingInformation || [],
              );
              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-7 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-medium">{order.name}</h2>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.processedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusPill(order.financialStatus)}
                      {statusPill(order.fulfillmentStatus)}
                    </div>
                  </div>

                  <div className="px-5 md:px-7 py-5 space-y-4">
                    {order.lineItems.nodes.map((line, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        {line.image?.url ? (
                          <img
                            src={line.image.url}
                            alt={line.image.altText || line.title}
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-lg bg-white/5"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-white/5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{line.title}</p>
                          {line.variantTitle && line.variantTitle !== "Default Title" && (
                            <p className="text-xs text-muted-foreground">{line.variantTitle}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Qty {line.quantity}</p>
                          <Link 
                            to={`/product/${line.product?.handle || line.productId?.split('/').pop()}?writeReview=true`}
                            className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                          >
                            Write a Review
                          </Link>
                        </div>
                        <p className="text-sm tabular-nums">
                          {formatMoney(line.price?.amount, line.price?.currencyCode)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 md:px-7 py-4 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground mr-2">Total</span>
                      <span className="font-medium tabular-nums">
                        {formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
                      </span>
                    </div>
                    {tracking && tracking.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tracking.map((t, i) =>
                          t.url ? (
                            <a
                              key={i}
                              href={t.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs underline underline-offset-4 text-primary"
                            >
                              Track {t.company || ""} {t.number || ""}
                            </a>
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;