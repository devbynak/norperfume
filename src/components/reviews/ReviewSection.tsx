import React, { useState, useEffect, useRef } from 'react';
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
  onStatsChange?: (stats: { averageRating: number; totalReviews: number }) => void;
}

export const ReviewSection = ({ productId, customerId, canWriteReview: initialCanWriteReview, onStatsChange }: ReviewSectionProps) => {
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
      // Improved Local Detection: Check for localhost, 127.0.0.1, or private network IPs
      const isLocalDev = 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        /^192\.168\./.test(window.location.hostname) ||
        /^10\./.test(window.location.hostname) ||
        window.location.port === '8082';
      
      let allCombined: Review[] = [];

      if (!isLocalDev) {
        try {
          const res = await fetch(`/api/reviews?product_id=${encodeURIComponent(productId)}&page=${page}`, { signal });
          if (signal?.aborted) return;
          
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const apiData = await res.json();
              const apiReviews = apiData.reviews || [];
              const realApiReviews = apiReviews.filter((r: any) => !r.id.startsWith('mock-'));
              allCombined = [...realApiReviews];
            }
          }
        } catch (e) {
          console.warn("Review API failed, using mocks:", e);
        }
      }

      // Always include local mocks
      const localMockReviews = getMockReviewsForProduct(productId);
      allCombined = [...allCombined, ...localMockReviews].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      updateStateWithReviews(allCombined, page);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      const localMockReviews = getMockReviewsForProduct(productId);
      updateStateWithReviews(localMockReviews, page);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStateWithReviews = (allReviews: Review[], page: number) => {
    const total = allReviews.length;
    const avg = total > 0 
      ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
      : 0;

    const limit = 10;
    const pCount = Math.ceil(total / limit);
    const paginated = allReviews.slice((page - 1) * limit, page * limit);

    setReviews(paginated);
    const newStats = {
      averageRating: parseFloat(avg as string),
      totalReviews: total
    };
    setStats(newStats);
    onStatsChange?.(newStats);
    setPagination({
      page,
      pages: pCount
    });
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
      // Improved Local Detection: Check for localhost, 127.0.0.1, or private network IPs
      const isLocalDev = 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        /^192\.168\./.test(window.location.hostname) ||
        /^10\./.test(window.location.hostname) ||
        window.location.port === '8082';

      if (isLocalDev) {
        setIsEligible(false);
        setHasReviewed(false);
        setResolvedCustomerId(null);
        return;
      }

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
    <section className="pb-4 pt-8 md:pb-6 md:pt-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-12 mb-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[8px] tracking-[0.4em] uppercase text-primary font-bold">Customer Feedback</p>
              <h2 className="font-display text-3xl md:text-5xl text-white italic uppercase">Community Reviews</h2>
            </div>
            
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-display text-white tracking-tighter leading-none">
                  {stats.averageRating}
                </span>
                <span className="text-sm text-white/20 font-light italic">/ 5.0</span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.round(stats.averageRating) ? 'fill-primary text-primary' : 'text-white/[0.05]'}`} 
                    />
                  ))}
                </div>
                <p className="text-[8px] tracking-[0.2em] uppercase font-bold text-white/40">
                  {stats.totalReviews} Verified Experiences
                </p>
              </div>
            </div>
          </div>

          {canShowButton && (
            <div className="flex">
              <Button 
                onClick={() => { haptic("light"); setShowForm(!showForm); }}
                className="h-12 px-10 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/5 text-white/80 hover:bg-white/[0.08] hover:text-white transition-all text-[10px] tracking-[0.3em] font-bold"
                disabled={isCheckingEligibility}
              >
                {showForm ? 'CANCEL' : 'WRITE A REVIEW'}
              </Button>
            </div>
          )}
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
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-4 px-1 scrollbar-hide snap-x snap-mandatory overscroll-x-contain touch-pan-x"
            >
              {reviews.map((review, idx) => (
                <motion.div 
                  key={review.id}
                  data-review-card
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="min-w-[calc(100vw-3rem)] sm:min-w-[400px] max-w-[400px] snap-center will-change-transform"
                >
                  <div className="h-full bg-[#121212] border border-white/[0.05] p-5 sm:p-8 rounded-[1.5rem] md:rounded-[2rem] relative group/card hover:border-primary/20 transition-all duration-700">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-0.5 pt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-white/[0.05]'}`} 
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/[0.03]">
                          <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[7px] font-bold tracking-[0.1em] text-primary uppercase">Verified</span>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8 flex-grow font-light tracking-wide">
                        "{review.review}"
                      </p>

                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-white tracking-[0.2em] uppercase">{review.user_name || 'Anonymous'}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-white/30 tracking-widest uppercase">NOR Enthusiast</span>
                          
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
                                className="p-2 text-white/20 hover:text-primary transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => { haptic("medium"); handleDelete(review.id); }}
                                className="p-2 text-white/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white/[0.005] border border-white/[0.03] border-dashed rounded-[3rem]">
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
