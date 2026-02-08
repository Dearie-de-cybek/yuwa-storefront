import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Upload, Check, Camera, ThumbsUp } from 'lucide-react';

export default function ReviewsSection() {
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);

  // MOCK REVIEWS
  const reviews = [
    {
      id: 1,
      name: "Amara N.",
      date: "2 days ago",
      rating: 5,
      fit: "True to Size",
      title: "Absolutely stunning!",
      content: "The silk feels incredible against my skin. I wore this to a wedding and got so many compliments. It flows beautifully.",
      images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=400&auto=format&fit=crop"],
      verified: true
    },
    {
      id: 2,
      name: "Jessica T.",
      date: "1 week ago",
      rating: 4,
      fit: "Runs Large",
      title: "Beautiful but long",
      content: "The fabric is top tier, but I'm 5'2 and had to get it hemmed. Otherwise perfect.",
      images: [],
      verified: true
    }
  ];

  return (
    <div className="py-16 border-t border-border mt-20" id="reviews-section">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <h2 className="font-serif text-3xl mb-10 text-center">Customer Reviews</h2>

        {/* 1. SUMMARY HEADER (Babyboo Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 items-center bg-secondary/30 p-8 rounded-sm">
          {/* Stars */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill="#1A1A1A" className="text-primary" />)}
            </div>
            <p className="text-2xl font-serif">4.8 <span className="text-sm text-muted font-sans">/ 5</span></p>
            <p className="text-xs text-muted mt-1">Based on 12 reviews</p>
          </div>

          {/* Fit Slider */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest text-muted mb-2">
                <span>Runs Small</span>
                <span>True to Size</span>
                <span>Runs Large</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                {/* The "Marker" showing average fit */}
                <div className="absolute top-0 bottom-0 left-[55%] w-1 bg-black" /> 
                <div className="h-full bg-accent w-[20%] ml-[45%] opacity-20" /> {/* Range visual */}
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

        {/* 2. WRITE REVIEW FORM (Collapsible) */}
        <AnimatePresence>
          {isWriting && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-16"
            >
              <form className="bg-white border border-border p-8 space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <p className="text-sm uppercase tracking-widest mb-4">How would you rate this item?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          className={star <= rating ? "fill-accent text-accent" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-2">Review Title</label>
                    <input className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent" placeholder="e.g. Stunning dress!" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted mb-2">How was the fit?</label>
                    <select className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent">
                      <option>True to Size</option>
                      <option>Runs Small</option>
                      <option>Runs Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-2">Your Review</label>
                  <textarea rows={4} className="w-full bg-secondary border-none p-4 outline-none focus:ring-1 focus:ring-accent" placeholder="Tell us what you liked..." />
                </div>

                {/* Photo Upload Area */}
                <div className="border-2 border-dashed border-gray-200 p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <Camera className="mx-auto text-muted group-hover:text-accent mb-2" size={32} />
                  <p className="text-sm text-muted">Click to upload photos (Max 3)</p>
                </div>

                <button className="w-full bg-primary text-white py-4 uppercase tracking-widest hover:bg-accent transition-colors">
                  Submit Review
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. REVIEWS LIST */}
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
                <span className="text-xs text-muted">{review.date}</span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-primary text-primary" : "text-gray-200"} />
                ))}
                <span className="text-xs text-muted ml-3 border-l border-gray-300 pl-3">Fit: <strong>{review.fit}</strong></span>
              </div>

              <h4 className="font-medium text-lg mb-2">{review.title}</h4>
              <p className="text-muted leading-relaxed mb-6">{review.content}</p>

              {/* Review Photos */}
              {review.images.length > 0 && (
                <div className="flex gap-4 mb-6">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-32 overflow-hidden rounded-sm bg-gray-100">
                      <img src={img} alt="Customer review" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              )}

              <button className="flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors">
                <ThumbsUp size={14} /> Helpful (24)
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}