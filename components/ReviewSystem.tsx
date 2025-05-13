"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  verified: boolean;
}

interface ReviewSystemProps {
  modelId: string;
  reviews: Review[];
  onAddReview?: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
}

export default function ReviewSystem({ modelId, reviews, onAddReview }: ReviewSystemProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [filteredRating, setFilteredRating] = useState<number | null>(null);

  // Calculate average rating
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Get rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  // Sort and filter reviews
  const sortedAndFilteredReviews = [...reviews]
    .filter(review => filteredRating === null || review.rating === filteredRating)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  const handleSubmitReview = () => {
    if (!userRating || !comment.trim()) return;
    
    if (onAddReview) {
      onAddReview({
        userId: 'current-user-id', // This should come from auth context
        userName: 'Current User', // This should come from auth context
        rating: userRating,
        comment: comment.trim(),
        verified: true,
      });
    }
    
    // Reset form
    setUserRating(0);
    setComment('');
    setShowForm(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 border-b border-white/10 pb-8">
        {/* Average Rating */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-pink-400 mb-2">{averageRating}</div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`text-2xl ${
                  star <= Math.round(parseFloat(averageRating)) 
                    ? 'text-yellow-400' 
                    : 'text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400">{reviews.length} reviews</div>
        </div>
        
        {/* Rating Distribution */}
        <div className="md:col-span-8">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center mb-2" onClick={() => setFilteredRating(filteredRating === rating ? null : rating)}>
              <div className="w-12 text-sm cursor-pointer hover:text-pink-400">
                {rating} stars
              </div>
              <div className="flex-grow mx-2 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-pink-500 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm cursor-pointer hover:text-pink-400">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Review Filters & Add Review */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 outline-none"
            aria-label="Sort reviews by"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
          
          {filteredRating !== null && (
            <div className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm flex items-center">
              {filteredRating} Star Filter
              <button 
                onClick={() => setFilteredRating(null)} 
                className="ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-500 hover:bg-pink-600"
        >
          Write a Review
        </Button>
      </div>
      
      {/* Add Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold mb-4">Your Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-3xl cursor-pointer ${
                      star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this model..."
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="mr-2 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={!userRating || !comment.trim()}
                className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
              >
                Submit Review
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Reviews List */}
      <div className="space-y-6">
        {sortedAndFilteredReviews.length > 0 ? (
          sortedAndFilteredReviews.map((review) => (
            <div key={review.id} className="border-b border-white/10 pb-6 last:border-b-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                    {review.userImage ? (
                      <img 
                        src={review.userImage} 
                        alt={review.userName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{review.userName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{review.userName}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                      {review.verified && (
                        <span className="ml-2 text-green-400">✓ Verified Purchase</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`text-lg ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm whitespace-pre-line">{review.comment}</p>
              <div className="mt-2 flex items-center">
                <button className="text-sm text-gray-400 hover:text-pink-400 flex items-center">
                  <span className="mr-1">👍</span> Helpful ({review.likes})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No reviews match your current filters.
          </div>
        )}
      </div>
    </div>
  );
} 