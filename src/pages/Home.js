import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, Box, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Chip, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import ProductCard from '../components/ui/ProductCard';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartMessage, setCartMessage] = useState('');

  const productsPerPage = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products.php');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (if we add categories later)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-25':
          filtered = filtered.filter(product => product.price < 25);
          break;
        case '25-50':
          filtered = filtered.filter(product => product.price >= 25 && product.price <= 50);
          break;
        case '50-100':
          filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case 'over-100':
          filtered = filtered.filter(product => product.price > 100);
          break;
        default:
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartMessage('Please login to add items to cart');
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/cart.php', {
        product_id: product.id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartMessage('Product added to cart successfully!');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (error) {
      setCartMessage('Failed to add product to cart');
      setTimeout(() => setCartMessage(''), 3000);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Hero Section */}
      <Box className="text-center mb-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <Typography variant="h2" component="h1" className="font-bold mb-4">
          Welcome to ShopHub
        </Typography>
        <Typography variant="h5" className="mb-6 opacity-90">
          Discover amazing products at unbeatable prices
        </Typography>
        <Typography variant="body1" className="opacity-80">
          Quality products • Fast shipping • Excellent customer service
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Box className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          {/* Category Filter */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
            </Select>
          </FormControl>

          {/* Price Range Filter */}
          <FormControl fullWidth>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={priceRange}
              label="Price Range"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <MenuItem value="all">All Prices</MenuItem>
              <MenuItem value="under-25">Under $25</MenuItem>
              <MenuItem value="25-50">$25 - $50</MenuItem>
              <MenuItem value="50-100">$50 - $100</MenuItem>
              <MenuItem value="over-100">Over $100</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="price-low">Price (Low to High)</MenuItem>
              <MenuItem value="price-high">Price (High to Low)</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Active Filters */}
        <Box className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <Chip
              label={`Search: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory !== 'all' && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => setSelectedCategory('all')}
              color="primary"
              variant="outlined"
            />
          )}
          {priceRange !== 'all' && (
            <Chip
              label={`Price: ${priceRange}`}
              onDelete={() => setPriceRange('all')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Results Summary */}
      <Box className="mb-6 flex justify-between items-center">
        <Typography variant="h6" className="text-gray-700">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Typography>
        {cartMessage && (
          <Typography className={`px-4 py-2 rounded-lg ${
            cartMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {cartMessage}
          </Typography>
        )}
      </Box>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <Box className="text-center py-12">
          <Typography variant="h6" className="text-gray-500 mb-2">
            No products found
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {paginatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box className="flex justify-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
