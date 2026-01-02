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
      
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Reviews</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-900 font-bold text-lg mb-2">No reviews yet</p>
            <p className="text-sm text-gray-500">Reviews will appear here once users start leaving feedback.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg text-gray-900">{review.userName}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
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
                            : "fill-gray-100 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3 leading-relaxed">{review.comment}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md">Plan: {review.planId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

