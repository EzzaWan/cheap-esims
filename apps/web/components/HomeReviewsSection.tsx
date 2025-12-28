"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Star, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/safe-fetch";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  planId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export function HomeReviewsSection() {
  const { user, isLoaded } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [planId, setPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const data = await safeFetch<Review[]>(`${apiUrl}/reviews/all`, { showToast: false });
        // Get most recent 6 reviews
        const sorted = (data || []).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 6);
        setReviews(sorted);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to leave a review.", variant: "destructive" });
      return;
    }

    if (!planId.trim()) {
      toast({ title: "Plan required", description: "Please enter a plan ID.", variant: "destructive" });
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      toast({ title: "Invalid comment", description: "Comment must be at least 10 characters long.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const userName = user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Anonymous';
      
      await safeFetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: {
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        },
        body: JSON.stringify({
          planId: planId.trim(),
          userName,
          rating,
          comment: comment.trim(),
        }),
      });

      toast({ title: "Review submitted", description: "Thank you for your review!" });
      setShowReviewDialog(false);
      setComment("");
      setPlanId("");
      setRating(5);
      
      // Refresh reviews
      const data = await safeFetch<Review[]>(`${apiUrl}/reviews/all`, { showToast: false });
      const sorted = (data || []).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 6);
      setReviews(sorted);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to submit review.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white border-2 border-black p-8 shadow-hard">
      <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 border-2 border-black">
            <MessageSquare className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Customer Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? "fill-primary text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoaded && user && (
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-primary hover:text-black border-2 border-black rounded-none font-bold uppercase">
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-2 border-black shadow-hard max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold uppercase mb-2 block">Plan ID</label>
                    <input
                      type="text"
                      value={planId}
                      onChange={(e) => setPlanId(e.target.value)}
                      placeholder="Enter plan package code..."
                      className="w-full px-4 py-2 border-2 border-black rounded-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold uppercase mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= rating
                                ? "fill-primary text-primary"
                                : "text-gray-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold uppercase mb-2 block">Comment</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this plan..."
                      className="min-h-[120px] border-2 border-black rounded-none font-mono"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {comment.length}/1000 characters
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || !comment.trim() || !planId.trim()}
                    className="w-full bg-primary hover:bg-black hover:text-white text-black border-2 border-black rounded-none font-bold uppercase"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Link href="/reviews">
            <Button variant="outline" className="border-2 border-black rounded-none font-bold uppercase hover:bg-black hover:text-white">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-mono">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-bold uppercase text-lg">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-2 font-mono">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="border-2 border-black p-6 hover:shadow-hard-sm transition-all bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-lg uppercase">{review.userName}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs bg-primary/20 text-black px-2 py-0.5 border border-primary font-bold uppercase">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-primary text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm font-mono text-gray-700 mb-3 line-clamp-4">{review.comment}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400 font-mono uppercase">
                  {new Date(review.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 font-mono uppercase truncate max-w-[100px]">Plan: {review.planId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

