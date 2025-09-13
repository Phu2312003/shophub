import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton, Chip } from '@mui/material';

const ProductCard = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize image source to prevent unnecessary re-renders
  const imageSrc = useMemo(() => {
    return product.image_url || '/placeholder-product.jpg';
  }, [product.image_url]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  const toggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  }, [isFavorite]);

  return (
    <div className="card group overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
              </div>
            )}
            <img
              src={imageSrc}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />

            {/* Stock Status */}
            {product.stock <= 0 && (
              <div className="absolute top-2 left-2">
                <Chip
                  label="Out of Stock"
                  color="error"
                  size="small"
                  className="bg-red-500 text-white"
                />
              </div>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute top-2 left-2">
                <Chip
                  label="Low Stock"
                  color="warning"
                  size="small"
                  className="bg-orange-500 text-white"
                />
              </div>
            )}

            {/* Favorite Button */}
            <IconButton
              className="absolute top-2 right-2 bg-white hover:bg-gray-50 shadow-md"
              size="small"
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <Favorite className="text-red-500" />
              ) : (
                <FavoriteBorder className="text-gray-600" />
              )}
            </IconButton>

            {/* Quick Add to Cart Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <IconButton
                className="bg-primary-500 hover:bg-primary-600 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart />
              </IconButton>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4em',
                  maxHeight: '2.8em'
                }}>
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-2 overflow-hidden"
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 2,
                 WebkitBoxOrient: 'vertical',
                 lineHeight: '1.3em',
                 maxHeight: '2.6em'
               }}>
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary-600">
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">
                    {i < Math.floor(product.rating || 4) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-1">
                ({product.reviews || 0})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
