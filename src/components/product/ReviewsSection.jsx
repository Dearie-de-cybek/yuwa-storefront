'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const FIT_OPTIONS = ['True to Size', 'Runs Small', 'Runs Large'];

const formatDate = (d) => {
  const diff = (Date.now() - new Date(d).getTime()) / 86400000;
  if (diff < 1) return 'Today';
  if (diff < 2) return 'Yesterday';
  if (diff < 7) return `${Math.floor(diff)} days ago`;
  return new Date(d).toLocaleDateString();
};

export default function ReviewsSection({ productId }) {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ title: '', content: '', fit: 'True to Size' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!productId) return;
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data.reviews || []);
      setSummary(data.summary || { average: 0, count: 0 });
    } catch {
      /* keep empty */
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Please log in to write a review');
    if (rating < 1) return toast.error('Please choose a star rating');

    setSubmitting(true);
    try {
      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, title: form.title, content: form.content, fit: form.fit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Thank you for your review!');
      setIsWriting(false);
      setRating(0);
      setForm({ title: '', content: '', fit: 'True to Size' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 border-t border-border mt-20" id="reviews-section">
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="font-serif text-3xl mb-10 text-center">Customer Reviews</h2>

        {/* SUMMARY HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 items-center bg-secondary/30 p-8 rounded-sm">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className={s <= Math.round(summary.average) ? 'fill-primary text-primary' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-2xl font-serif">
              {summary.average.toFixed(1)} <span className="text-sm text-muted font-sans">/ 5</span>
            </p>
            <p className="text-xs text-muted mt-1">Based on {summary.count} review{summary.count !== 1 ? 's' : ''}</p>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest text-muted mb-2">
                <span>Runs Small</span>
                <span>True to Size</span>
                <span>Runs Large</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-[55%] w-1 bg-black" />
                <div className="h-full bg-accent w-[20%] ml-[45%] opacity-20" />
              </div>
            </div>

            <button
              onClick={() => setIsWriting(!isWriting)}
              className="w-full md:w-auto px-8 py-3 bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-widest"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* WRITE REVIEW FORM */}
        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-16"
            >
              <form onSubmit={submitReview} className="bg-white border border-border p-8 space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <p className="text-sm uppercase tracking-widest mb-4">How would you rate this item?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                        <Star size={32} className={star <= rating ? 'fill-accent text-accent' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-2">Review Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent"
                      placeholder="e.g. Stunning dress!"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-2">How was the fit?</label>
                    <select
                      value={form.fit}
                      onChange={(e) => setForm({ ...form, fit: e.target.value })}
                      className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent"
                    >
                      {FIT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Tell us what you liked..."
                  />
                </div>

                <div className="border-2 border-dashed border-gray-200 p-8 text-center text-muted">
                  <Camera className="mx-auto mb-2" size={32} />
                  <p className="text-sm">Photo uploads coming soon</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REVIEWS LIST */}
        {reviews.length === 0 ? (
          <p className="text-center text-muted py-10">No reviews yet — be the first to share your thoughts.</p>
        ) : (
          <div className="space-y-12">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-12 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-medium text-lg">{review.name}</span>
                    {review.verified && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
                        <Check size={10} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-primary text-primary' : 'text-gray-200'} />
                  ))}
                  {review.fit && (
                    <span className="text-xs text-muted ml-3 border-l border-gray-300 pl-3">
                      Fit: <strong>{review.fit}</strong>
                    </span>
                  )}
                </div>

                {review.title && <h4 className="font-medium text-lg mb-2">{review.title}</h4>}
                {review.content && <p className="text-muted leading-relaxed mb-6">{review.content}</p>}

                {review.images.length > 0 && (
                  <div className="flex gap-4 mb-6">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-24 h-32 overflow-hidden rounded-sm bg-gray-100">
                        <img src={img} alt="Customer review" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
