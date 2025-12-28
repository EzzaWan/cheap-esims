"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Star, CheckCircle2, MessageSquare } from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface Review {
  id: string;
  planId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export default function ReviewsPage() {
  const { user, isLoaded } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const data = await safeFetch<Review[]>(`${apiUrl}/reviews/all`, { showToast: false });
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reviews' }]} />
      
      <div className="bg-white border-2 border-black p-8 shadow-hard">
        <div className="flex items-center gap-4 mb-6 border-b-2 border-black pb-4">
          <div className="bg-primary p-3 border-2 border-black">
            <MessageSquare className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">All Reviews</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-mono">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold uppercase text-lg">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-2 font-mono">Reviews will appear here once users start leaving feedback.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="border-2 border-black p-6 hover:shadow-hard transition-all">
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
                <p className="text-sm font-mono text-gray-700 mb-2 line-clamp-3">{review.comment}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-400 font-mono uppercase">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 font-mono uppercase">Plan: {review.planId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

