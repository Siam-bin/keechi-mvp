"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export function ReviewsSection({ shopId, userId, hasCompletedAppointment = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [shopId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews?shopId=${shopId}`);
      setReviews(response.data.reviews || []);

      // Check if current user has already reviewed
      if (userId) {
        const existing = response.data.reviews?.find((r) => r.userId === userId);
        setUserReview(existing);
      }
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/reviews", {
        shopId,
        rating,
        title,
        text,
      });

      setReviews((prev) => {
        // Replace existing review or add new one
        if (userReview) {
          return prev.map((r) => (r.userId === userId ? response.data.review : r));
        }
        return [response.data.review, ...prev];
      });

      setUserReview(response.data.review);
      setShowWriteReview(false);
      setTitle("");
      setText("");
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setUserReview(null);
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  // Render stars
  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? "fill-gold-500 text-gold-500" : "text-charcoal-300"}
          />
        ))}
      </div>
    );
  };

  // Calculate average and distribution
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-charcoal-900 mb-2">Reviews & Ratings</h2>
        <p className="text-charcoal-600 mb-8">See what customers think about this salon</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-gold-50 rounded-lg p-6 border border-gold-200">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gold-600 mb-2">{avgRating}</div>
              <div className="mb-2">{renderStars(Math.round(avgRating))}</div>
              <p className="text-charcoal-600 text-sm">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-charcoal-600 w-8">{stars}★</span>
                  <div className="flex-1 bg-charcoal-200 rounded-full h-2">
                    <div
                      className="bg-gold-500 h-2 rounded-full transition-all"
                      style={{
                        width:
                          reviews.length > 0
                            ? `${(ratingDistribution[stars] / reviews.length) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-charcoal-600 w-8 text-right">
                    {ratingDistribution[stars]}
                  </span>
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            {userId && !showWriteReview && (
              <button
                onClick={() => setShowWriteReview(true)}
                disabled={!hasCompletedAppointment && !userReview}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                  hasCompletedAppointment || userReview
                    ? "bg-gold-500 text-white hover:bg-gold-600"
                    : "bg-charcoal-200 text-charcoal-500 cursor-not-allowed"
                }`}
              >
                {userReview ? "Edit Your Review" : "Write a Review"}
              </button>
            )}

            {!userId && (
              <div className="mt-6 p-3 bg-charcoal-100 rounded-lg flex gap-2">
                <AlertCircle size={16} className="text-charcoal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-charcoal-600">Sign in to write a review</p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            {/* Write Review Form */}
            {showWriteReview && (userId || hasCompletedAppointment || userReview) && (
              <div className="mb-8 bg-charcoal-50 rounded-lg p-6 border border-charcoal-200">
                <h3 className="font-bold text-charcoal-900 mb-4">
                  {userReview ? "Edit Your Review" : "Write a Review"}
                </h3>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            size={28}
                            className={
                              star <= rating
                                ? "fill-gold-500 text-gold-500"
                                : "text-charcoal-300 hover:text-gold-400"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Great service!"
                      maxLength="100"
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-2">Review</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Share your experience..."
                      maxLength="500"
                      rows="4"
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <p className="text-xs text-charcoal-500 mt-1">{text.length}/500</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWriteReview(false)}
                      className="flex-1 px-4 py-2 border border-charcoal-300 text-charcoal-700 rounded-lg font-semibold hover:bg-charcoal-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {loading ? (
              <div className="text-center py-8 text-charcoal-500">Loading reviews...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-charcoal-500 bg-charcoal-50 rounded-lg">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-charcoal-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating, 14)}
                          <span className="font-semibold text-charcoal-900">{review.title}</span>
                        </div>
                        <p className="text-sm text-charcoal-600">
                          By {review.user?.name || "Anonymous"} •{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {userId === review.userId && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-charcoal-400 hover:text-red-600 transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <p className="text-charcoal-700 text-sm">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
