import React, { useState, useEffect } from "react";
import { Star, Quote, ThumbsUp, CheckCircle2, Send, Loader2 } from "lucide-react";
import { supabase } from "../api/supabase";

const StarRating = ({ rating, size = 16 }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "#D4AF37" : "none"}
        stroke={i < rating ? "#D4AF37" : "#E5E7EB"}
        strokeWidth={1.5}
        className="mr-0.5"
      />
    ))}
  </div>
);

const InteractiveStars = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        className="transition-transform hover:scale-110"
      >
        <Star
          size={28}
          fill={i < rating ? "#D4AF37" : "none"}
          stroke={i < rating ? "#D4AF37" : "#E5E7EB"}
          strokeWidth={1.5}
        />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [liked, setLiked] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 0,
    review: "",
    size: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
    };
    if (productId) fetchReviews();
  }, [productId]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.rating) errors.rating = "Please select a rating";
    if (!form.review.trim() || form.review.length < 10)
      errors.review = "Please write at least 10 characters";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: productId,
            name: form.name,
            location: form.location,
            rating: form.rating,
            review: form.review,
            size: form.size,
            verified: false,
            likes: 0,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setReviews((prev) => [data[0], ...prev]);
      }

      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", location: "", rating: 0, review: "", size: "" });
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6 mb-8">
      <div className="bg-white rounded-sm shadow-sm border border-[#E5E7EB] p-8 md:p-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-[#E5E7EB] pb-8 gap-6">
          <div>
            <h3 className="text-3xl font-display text-[#111827] font-semibold mb-1">
              Customer Reviews
            </h3>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Real buyers, real opinions
            </p>
          </div>

          {/* Rating Summary — only show if reviews exist */}
          {avgRating && (
            <div className="flex items-center gap-6 bg-[#FAF8F3] px-6 py-4 rounded-sm border border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-[#111827]">
                  {avgRating}
                </div>
                <StarRating rating={Math.round(avgRating)} size={14} />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
              <div className="space-y-1.5">
                {[5, 4, 3].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percent = Math.round((count / reviews.length) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-4">{star}</span>
                      <Star size={10} fill="#D4AF37" stroke="#D4AF37" />
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-sm mb-6 text-sm font-semibold">
            <CheckCircle2 size={18} />
            Thank you! Your review has been submitted successfully.
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#D4AF37]" />
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-sm mb-8">
            <Star size={40} className="mx-auto text-[#D4AF37]/30 mb-4" />
            <h4 className="font-display text-xl text-[#111827] mb-2">
              No Reviews Yet
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Be the first to share your experience!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-[#111827] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors rounded-sm"
            >
              ✍️ Write First Review
            </button>
          </div>
        ) : (
          /* Reviews List */
          <>
            <div className="space-y-6 mb-8">
              {displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-[#FAF8F3] rounded-sm border border-[#E5E7EB] relative overflow-hidden"
                >
                  <Quote size={40} className="absolute top-3 right-3 text-[#D4AF37]/10" />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white font-display font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#111827] text-sm">
                            {review.name}
                          </h4>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-wider">
                              <CheckCircle2 size={10} />
                              Verified
                            </span>
                          )}
                        </div>
                        {review.location && (
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {review.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>

                  {review.size && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3 font-semibold">
                      Size: {review.size}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {review.review}
                  </p>

                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                      liked[review.id]
                        ? "text-[#D4AF37]"
                        : "text-gray-400 hover:text-[#111827]"
                    }`}
                  >
                    <ThumbsUp size={12} fill={liked[review.id] ? "#D4AF37" : "none"} />
                    Helpful ({(review.likes || 0) + (liked[review.id] ? 1 : 0)})
                  </button>
                </div>
              ))}
            </div>

            {/* Show More */}
            {reviews.length > 3 && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 border border-[#111827] text-[#111827] text-xs font-semibold uppercase tracking-widest hover:bg-[#111827] hover:text-white transition-colors rounded-sm"
                >
                  {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Write Review Section */}
        <div className="border-t border-[#E5E7EB] pt-8">
          {!showForm ? (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">
                Purchased from us? Share your experience!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-[#111827] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors rounded-sm"
              >
                ✍️ Write a Review
              </button>
            </div>
          ) : (
            <div>
              <h4 className="text-xl font-display text-[#111827] font-semibold mb-6">
                Write Your Review
              </h4>

              <div className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Your Rating *
                  </label>
                  <InteractiveStars
                    rating={form.rating}
                    setRating={(r) => {
                      setForm((p) => ({ ...p, rating: r }));
                      setFormErrors((p) => ({ ...p, rating: "" }));
                    }}
                  />
                  {formErrors.rating && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>
                  )}
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha K."
                      value={form.name}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, name: e.target.value }));
                        setFormErrors((p) => ({ ...p, name: "" }));
                      }}
                      className="w-full border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] bg-gray-50"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      City (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      className="w-full border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] bg-gray-50"
                    />
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Size Purchased (Optional)
                  </label>
                  <select
                    value={form.size}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, size: e.target.value }))
                    }
                    className="w-full border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] bg-gray-50"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience with this product..."
                    value={form.review}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, review: e.target.value }));
                      setFormErrors((p) => ({ ...p, review: "" }));
                    }}
                    className="w-full border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] bg-gray-50 resize-none"
                  />
                  {formErrors.review && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.review}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-[#111827] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors rounded-sm disabled:opacity-70"
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormErrors({});
                    }}
                    className="px-8 py-3 border border-[#E5E7EB] text-gray-500 text-xs font-semibold uppercase tracking-widest hover:border-[#111827] hover:text-[#111827] transition-colors rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
