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
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 border border-gray-200 rounded-full shadow-sm">
            <MessageSquare className="h-6 w-6 text-primary-dark" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
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
                <Button className="bg-black text-white hover:bg-primary-dark hover:text-white rounded-lg font-bold">
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border border-gray-200 shadow-xl rounded-xl max-w-md sm:rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-700">Plan ID</label>
                    <input
                      type="text"
                      value={planId}
                      onChange={(e) => setPlanId(e.target.value)}
                      placeholder="Enter plan package code..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-700">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transform hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-700">Comment</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this plan..."
                      className="min-h-[120px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.length}/1000 characters
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || !comment.trim() || !planId.trim()}
                    className="w-full bg-primary hover:bg-primary-dark text-black font-bold rounded-lg"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Link href="/reviews">
            <Button variant="outline" className="border border-gray-300 rounded-lg font-bold hover:bg-gray-50 text-gray-700">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-bold text-lg">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-2">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-lg text-gray-900">{review.userName}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 font-medium">
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
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-4 leading-relaxed">{review.comment}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium">
                  {new Date(review.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 font-medium truncate max-w-[100px]">Plan: {review.planId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



