import React, { useState } from 'react';
import { StarIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HandThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProductReviews = ({ productId, reviews = [], rating = 0, reviewCount = 0 }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const handleHelpfulVote = (reviewId, isHelpful) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: isHelpful
    }));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpfulCount - a.helpfulCount;
      default:
        return 0;
    }
  });

  const filteredReviews = sortedReviews.filter(review => 
    filterRating === 'all' || review.rating === parseInt(filterRating)
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = 'h-5 w-5') => {
    return [...Array(5)].map((_, i) => (
      i < rating ? (
        <StarIconSolid key={i} className={`${size} text-yellow-400`} />
      ) : (
        <StarIcon key={i} className={`${size} text-gray-300`} />
      )
    ));
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(rating))}
            </div>
            <p className="text-gray-600">Based on {reviewCount} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
          {['all', '5', '4', '3', '2', '1'].map(rating => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filterRating === rating
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {rating === 'all' ? 'All' : `${rating}★`}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to review this product!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(review.rating, 'h-4 w-4')}
                  </div>
                  {review.isVerified && (
                    <Badge variant="success" size="sm">Verified Purchase</Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpfulVote(review.id, true)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      helpfulVotes[review.id] === true
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    {helpfulVotes[review.id] === true ? (
                      <ThumbUpIconSolid className="h-4 w-4" />
                    ) : (
                      <HandThumbUpIcon className="h-4 w-4" />
                    )}
                    <span>Helpful ({review.helpfulCount || 0})</span>
                  </button>
                </div>
                
                {review.reply && (
                  <Badge variant="info" size="sm">Seller Replied</Badge>
                )}
              </div>

              {review.reply && (
                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="nepal" size="sm">Doko Team</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.reply.date)}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.reply.message}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More Reviews */}
      {filteredReviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
