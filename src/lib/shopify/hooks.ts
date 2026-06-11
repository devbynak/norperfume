import { useQuery } from "@tanstack/react-query";
import { buildHeroSlides, fetchHybridCollection, fetchHybridCollections, fetchHybridProduct, fetchHybridProducts } from "./shopify";

const SHOPIFY_STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours
const SHOPIFY_GC_TIME = 1000 * 60 * 60 * 48; // 48 hours

// React Query layer: extra safety net on top of client-level retries.
// Exponential backoff capped at 8s, 2 outer retries.
const SHOPIFY_RETRY = 2;
const SHOPIFY_RETRY_DELAY = (attempt: number) =>
  Math.min(1000 * 2 ** attempt, 8000) + Math.random() * 250;

export function useHybridProducts(limit = 20) {
  return useQuery({
    queryKey: ["shopify", "products", limit],
    queryFn: () => fetchHybridProducts(limit),
    staleTime: SHOPIFY_STALE_TIME,
    gcTime: SHOPIFY_GC_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useHybridCollections(limit = 20) {
  return useQuery({
    queryKey: ["shopify", "collections", limit],
    queryFn: () => fetchHybridCollections(limit),
    staleTime: SHOPIFY_STALE_TIME,
    gcTime: SHOPIFY_GC_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useHybridCollection(handle: string) {
  return useQuery({
    queryKey: ["shopify", "collection", handle],
    queryFn: () => fetchHybridCollection(handle),
    enabled: Boolean(handle),
    staleTime: SHOPIFY_STALE_TIME,
    gcTime: SHOPIFY_GC_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useHybridProduct(idOrHandle?: string) {
  return useQuery({
    queryKey: ["shopify", "product", idOrHandle],
    queryFn: () => fetchHybridProduct(idOrHandle || ""),
    enabled: Boolean(idOrHandle),
    staleTime: SHOPIFY_STALE_TIME,
    gcTime: SHOPIFY_GC_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useHeroSlides() {
  const collectionsQuery = useHybridCollections();

  return {
    data: collectionsQuery.data ? buildHeroSlides([], collectionsQuery.data) : [],
    isLoading: collectionsQuery.isLoading,
    isError: collectionsQuery.isError,
  };
}

export function useCollectionProducts(handle: string) {
  const collectionsQuery = useHybridCollections();
  const collection = collectionsQuery.data?.find((item) => item.handle === handle);

  return {
    data: collection?.products || [],
    isLoading: collectionsQuery.isLoading,
    isError: collectionsQuery.isError,
  };
}
