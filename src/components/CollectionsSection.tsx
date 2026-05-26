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
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link
        to={`/products?collection=${encodeURIComponent(collection.handle)}`}
        className={`group relative block overflow-hidden rounded-xl ${className}`}
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
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] uppercase text-primary font-semibold">
            The Signature Series
          </p>
          <h2 className="font-display text-4xl text-foreground md:text-5xl">
            Explore Our Collections
          </h2>
        </div>

        {isLoading && !visibleCollections.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 min-h-[300px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[4/5] bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : visibleCollections.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {visibleCollections.map((collection, index) => (
              <CollectionTile
                key={collection.handle}
                collection={collection}
                index={index}
                className="aspect-[4/3] sm:aspect-[4/5] md:aspect-[4/5]"
                titleClassName="text-sm md:text-base tracking-[0.2em]"
                titlePositionClassName="items-center justify-center"
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center text-muted-foreground">No Shopify collections found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 min-h-[300px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[4/5] bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
