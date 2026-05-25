import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, MessageSquare, ShieldCheck, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getMockReviewsForProduct, Review } from '@/data/mockReviews';
import { haptic } from '@/lib/haptics';

interface ReviewSectionProps {
  productId: string;
  customerId?: string;
  canWriteReview?: boolean;
}

export const ReviewSection = ({ productId, customerId, canWriteReview: initialCanWriteReview }: ReviewSectionProps) => {
  const location = useLocation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // New eligibility states
  const [isEligible, setIsEligible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [resolvedCustomerId, setResolvedCustomerId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (isLoading || reviews.length <= 1 || isHovered || showForm || editingReview) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const cardWidth = container.querySelector('[data-review-card]')?.clientWidth || 400;
        const gap = 24; // gap-6 is 24px
        const scrollAmount = cardWidth + gap;
        
        const isAtEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 50;

        if (isAtEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollTo({ 
            left: container.scrollLeft + scrollAmount, 
            behavior: 'smooth' 
          });
        }
      }
    }, 5000); // Every 5 seconds for a premium feel

    return () => clearInterval(interval);
  }, [isLoading, reviews.length, isHovered, showForm, editingReview]);

  const fetchReviews = async (page = 1, signal?: AbortSignal) => {
    if (signal?.aborted) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?product_id=${encodeURIComponent(productId)}&page=${page}`, { signal });
      if (signal?.aborted) return;
      
      let apiData = { reviews: [], stats: { averageRating: 0, totalReviews: 0 }, pagination: { page: 1, pages: 1 } };
      
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          apiData = await res.json();
        } else {
          // Silent fallback for non-JSON (likely HTML error pages in local dev)
        }
      }

      // 2. Get mock reviews from local data
      const localMockReviews = getMockReviewsForProduct(productId);

      // 3. Combine and sort (if API failed, we just use local mocks)
      // Note: If API worked, it already has mocks in the current implementation, 
      // but we'll merge them here to be safe and ensure they show up in local dev.
      const apiReviews = apiData.reviews || [];
      
      // Filter out mocks from API to avoid double-counting if API is already including them
      const realApiReviews = apiReviews.filter((r: any) => !r.id.startsWith('mock-'));
      
      const allCombined = [...realApiReviews, ...localMockReviews].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // 4. Update stats based on combined data
      const total = allCombined.length;
      const avg = total > 0 
        ? (allCombined.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
        : 0;

      // 5. Apply frontend pagination for now to ensure local dev works perfectly
      const limit = 10;
      const pCount = Math.ceil(total / limit);
      const paginated = allCombined.slice((page - 1) * limit, page * limit);

      setReviews(paginated);
      setStats({
        averageRating: parseFloat(avg as string),
        totalReviews: total
      });
      setPagination({
        page,
        pages: pCount
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      // Fallback to only mock reviews if API fails completely
      const localMockReviews = getMockReviewsForProduct(productId);
      const total = localMockReviews.length;
      const avg = total > 0 ? (localMockReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;
      
      setReviews(localMockReviews.slice(0, 10));
      setStats({ averageRating: parseFloat(avg as string), totalReviews: total });
      setPagination({ page: 1, pages: Math.ceil(total / 10) });
    } finally {
      setIsLoading(false);
    }
  };

  const checkEligibility = async (signal?: AbortSignal) => {
    if (signal?.aborted) return;
    if (!customerId) {
      setIsEligible(false);
      setHasReviewed(false);
      setResolvedCustomerId(null);
      return;
    }

    setIsCheckingEligibility(true);
    try {
      const res = await fetch(`/api/review/eligibility?product_id=${encodeURIComponent(productId)}&customer_id=${encodeURIComponent(customerId)}`, { signal });
      if (signal?.aborted) return;
      const data = await res.json();
      setIsEligible(data.eligible);
      setHasReviewed(data.hasReviewed);
      setResolvedCustomerId(data.resolvedId);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchReviews(1, controller.signal);
    checkEligibility(controller.signal);
    
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, customerId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('writeReview') === 'true' && isEligible && !hasReviewed) {
      setShowForm(true);
      setTimeout(() => {
        const form = document.getElementById('review-form-anchor');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search, isEligible, hasReviewed]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await fetch('/api/review/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, customerId })
      });
      
      if (res.ok) {
        toast.success('Review deleted');
        fetchReviews();
        checkEligibility(); // Refresh eligibility
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete review');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const canShowButton = isEligible && !hasReviewed;

  return (
    <section className="pb-16 pt-4 md:pb-24 md:pt-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-bold">Customer Feedback</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">Community Reviews</h2>
            
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-display text-foreground tracking-tighter">
                  {stats.averageRating}
                </span>
                <span className="text-sm text-muted-foreground/60 font-medium">/ 5.0</span>
              </div>
              
              <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
              
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.round(stats.averageRating) ? 'fill-primary text-primary' : 'text-white/10'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] tracking-[0.1em] uppercase font-bold text-muted-foreground/60">
                  {stats.totalReviews} Verified Experiences
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {canShowButton && (
              <Button 
                onClick={() => { haptic("light"); setShowForm(!showForm); }}
                className="h-12 px-8 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 text-foreground hover:bg-white/[0.08] transition-all text-xs tracking-widest font-bold"
                disabled={isCheckingEligibility}
              >
                {showForm ? 'CANCEL' : 'WRITE A REVIEW'}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {(showForm || editingReview) && (
            <motion.div
              id="review-form-anchor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-2xl mx-auto mb-20"
            >
              <ReviewForm 
                productId={productId} 
                customerId={customerId} 
                initialData={editingReview || undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingReview(null);
                  fetchReviews();
                  checkEligibility();
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          null
        ) : reviews.length > 0 ? (
          <div 
            className="relative group/scroll"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-12 pt-4 px-1 scrollbar-hide snap-x snap-mandatory"
            >
              {reviews.map((review, idx) => (
                <motion.div 
                  key={review.id}
                  data-review-card
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="min-w-[300px] md:min-w-[400px] max-w-[400px] snap-center"
                >
                  <div className="h-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] relative group/card hover:bg-white/[0.04] transition-all duration-500">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-white/5'}`} 
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <ShieldCheck className="w-3 h-3 text-primary" />
                          <span className="text-[9px] font-bold tracking-widest text-primary uppercase">Verified</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground/90 text-sm leading-relaxed mb-8 flex-grow">
                        "{review.review}"
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground tracking-widest uppercase">{review.user_name || 'Anonymous'}</span>
                          <span className="text-[10px] text-muted-foreground/40 mt-1">NOR Enthusiast</span>
                        </div>
                        
                        {resolvedCustomerId === review.user_id && (
                          <div className="flex gap-1">
                            <button 
                              onClick={() => {
                                haptic("light");
                                setEditingReview(review);
                                setTimeout(() => {
                                  const form = document.getElementById('review-form-anchor');
                                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { haptic("medium"); handleDelete(review.id); }}
                              className="p-2 text-muted-foreground/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Subtle Scroll Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5">
              <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary/40 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem]">
            <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-6" />
            <h3 className="text-xl font-display text-foreground mb-3">No reviews yet</h3>
            <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto">Be the first to share your experience with the NOR collection.</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface ReviewFormProps {
  productId: string;
  customerId?: string;
  token?: string;
  onSuccess: () => void;
  initialData?: Review;
}

export const ReviewForm = ({ productId, customerId, token, onSuccess, initialData }: ReviewFormProps) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [review, setReview] = useState(initialData?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    for (let i = 1; i <= selectedRating; i++) {
      setTimeout(() => {
        haptic("selection");
      }, (i - 1) * 60);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return toast.error('Please write a review');
    
    setIsSubmitting(true);
    try {
      const url = initialData ? '/api/review/update' : '/api/review/submit';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialData?.id,
          rating,
          review,
          productId,
          customerId,
          token
        })
      });

      if (res.ok) {
        toast.success(initialData ? 'Review updated!' : 'Review submitted successfully!');
        onSuccess();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-primary/20 p-8 rounded-3xl space-y-6 shadow-xl shadow-primary/5">
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-display text-foreground">
          {initialData ? 'Edit Your Review' : 'How was your experience?'}
        </h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={star <= rating ? { 
                scale: [1, 1.3, 1], 
                rotate: [0, 15, 0] 
              } : { scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 15, 
                delay: star <= rating ? (star - 1) * 0.05 : 0 
              }}
              className="focus:outline-none"
            >
              <Star 
                className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review-text" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Review</label>
        <textarea
          id="review-text"
          name="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about the product quality and performance..."
          className="w-full min-h-[120px] bg-background border border-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-12 gradient-gold text-primary-foreground font-bold rounded-full"
      >
        {isSubmitting ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  );
};
