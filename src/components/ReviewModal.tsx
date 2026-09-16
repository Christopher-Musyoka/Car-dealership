import React, { useState } from 'react';
import { X, Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { submitReview } from '../lib/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const [customerName, setCustomerName] = useState('');
  const [vehiclePurchased, setVehiclePurchased] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !review.trim()) {
      setError('Please provide your name and your review.');
      return;
    }

    setLoading(true);
    try {
      await submitReview({
        customerName,
        rating,
        review,
        vehiclePurchased: vehiclePurchased.trim() || undefined
      });
      setSuccess(true);
      onReviewSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setError(null);
    setCustomerName('');
    setVehiclePurchased('');
    setReview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          id="btn-close-review-modal"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Review Submitted!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-400">{customerName}</strong>! Your experience helps build confidence for fellow Kenyan car buyers along Kangundo Road.
            </p>
            <button
              id="btn-review-success-done"
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors mt-4"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pr-8">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Netwon Cars Kangundo Road
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Leave a Customer Review
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Share your car buying, trade-in, or viewing experience with our team.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Star Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-amber-400 font-bold ml-2">{rating} out of 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name *
              </label>
              <input
                id="review-name-input"
                type="text"
                required
                placeholder="e.g. Christine Mutua"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Vehicle Purchased or Inspected (Optional)
              </label>
              <input
                id="review-vehicle-input"
                type="text"
                placeholder="e.g. 2018 Toyota Harrier or Mazda CX-5"
                value={vehiclePurchased}
                onChange={(e) => setVehiclePurchased(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Review *
              </label>
              <textarea
                id="review-text-input"
                rows={4}
                required
                placeholder="Describe vehicle condition, customer care, logbook transfer, or overall transparency..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              id="btn-submit-review"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Post Review</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
