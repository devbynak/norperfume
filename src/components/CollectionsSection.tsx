import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { CollectionCard as ShopifyCollectionCard } from "@/data/products";
import { useHybridCollections } from "@/lib/shopify/hooks";

const PRIORITY_HANDLES = ["best-seller", "new-arrival", "all-collection"];
const EXCLUDED_HANDLES = new Set(["hero-slider", "frontpage"]);

function sortCollections(collections: ShopifyCollectionCard[]) {
  return [...collections].sort((left, right) => {
    const leftPriority = PRIORITY_HANDLES.indexOf(left.handle);
    const rightPriority = PRIORITY_HANDLES.indexOf(right.handle);

    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) return 1;
      if (rightPriority === -1) return -1;
      return leftPriority - rightPriority;
    }

    return left.title.localeCompare(right.title);
  });
}

function CollectionTile({
  collection,
  index,
  className,
  titleClassName,
  titlePositionClassName,
}: {
  collection: ShopifyCollectionCard;
  index: number;
  className: string;
  titleClassName: string;
  titlePositionClassName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/products?collection=${encodeURIComponent(collection.handle)}`}
        className={`group relative block overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] ${className}`}
      >
        <img
          src={collection.image}
          alt={collection.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background/30" />
        <div className={`absolute inset-0 flex ${titlePositionClassName}`}>
          <span
            className={`glass-card px-4 py-2 font-display text-xs tracking-[0.2em] text-foreground uppercase rounded-sm backdrop-blur-md border border-white/10 ${titleClassName}`}
          >
            {collection.title}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

const CollectionsSection = () => {
  const { data: collections = [], isLoading } = useHybridCollections();

  const visibleCollections = sortCollections(
    collections.filter(
      (collection) => !EXCLUDED_HANDLES.has(collection.handle) && Boolean(collection.image),
    ),
  ).slice(0, 3); // Keep the top 3 for the one-row layout

  return (
    <section className="relative px-4 py-20 md:py-32 overflow-hidden bg-background">
      {/* Top & Bottom Section Blends */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10" />

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-20">
        <div className="mb-10 md:mb-20 text-center space-y-3">
          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-primary font-bold">The Signature Series</p>
          <h2 className="font-display text-3xl md:text-6xl lg:text-7xl text-foreground font-bold tracking-tighter uppercase italic leading-[0.9]">
            Explore Our <span className="text-white/60">Collections</span>
          </h2>
        </div>

        {isLoading && !visibleCollections.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 min-h-[400px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[4/5] bg-white/[0.03] rounded-[2rem] md:rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : visibleCollections.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
            {visibleCollections.map((collection, index) => (
              <CollectionTile
                key={collection.handle}
                collection={collection}
                index={index}
                className="aspect-[4/3] sm:aspect-[4/5] md:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] w-full max-w-sm mx-auto sm:max-w-none"
                titleClassName="text-xs md:text-sm tracking-[0.3em] font-bold"
                titlePositionClassName="items-center justify-center"
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem]">
            <p className="text-muted-foreground font-light tracking-widest uppercase text-xs">No Shopify collections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 min-h-[400px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[4/5] bg-white/[0.03] rounded-[2rem] animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
