import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography, Button, TextField, Grid, Card, CardContent, CardMedia, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Edit, Delete, Add, CloudUpload, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 0) fetchProducts();
    else if (activeTab === 1) fetchOrders();
    else if (activeTab === 2) fetchUsers();
  }, [activeTab]);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/products.php', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/orders.php?admin=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Failed to load orders');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/users.php', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to load users');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      let imageUrl = newProduct.image_url;

      // If there's an uploaded file, we'd need to upload it to a server first
      // For now, we'll use the image_url field
      if (imageFile) {
        // In a real application, you'd upload the file to a server and get back a URL
        // For demo purposes, we'll use a placeholder
        imageUrl = imagePreview;
      }

      const productData = { ...newProduct, image_url: imageUrl };

      await axios.post('http://localhost:8000/api/products.php', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewProduct({ name: '', description: '', price: '', stock: '', image_url: '' });
      setImageFile(null);
      setImagePreview('');
      setMessage('Product added successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });
    setEditImagePreview(product.image_url);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: '', description: '', price: '', stock: '', image_url: '' });
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      let imageUrl = editForm.image_url;

      if (editImageFile) {
        // In a real application, you'd upload the file to a server
        imageUrl = editImagePreview;
      }

      const productData = { ...editForm, image_url: imageUrl };

      await axios.put(`http://localhost:8000/api/products.php?id=${editingProduct.id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Product updated successfully!');
      cancelEdit();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/products.php?id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Failed to delete product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/orders.php?id=${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage('Failed to update order status');
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h3" component="h1" className="mb-8 font-bold text-gray-900">
        Admin Dashboard
      </Typography>

      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} className="mb-6">
          {message}
        </Alert>
      )}

      <Paper elevation={2} className="mb-6">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="border-b">
          <Tab label="Products" />
          <Tab label="Orders" />
          <Tab label="Users" />
        </Tabs>
      </Paper>

      {/* Products Tab */}
      {activeTab === 0 && (
        <div>
          {/* Add New Product Form */}
          <Paper elevation={2} className="p-6 mb-6">
            <Typography variant="h5" className="mb-4 font-semibold">
              Add New Product
            </Typography>

            <form onSubmit={addProduct}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                    placeholder="Enter image URL or upload file below"
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current.click()}
                    fullWidth
                    className="mb-4"
                  >
                    Upload Product Image
                  </Button>

                  {imagePreview && (
                    <Box className="mt-4">
                      <Typography variant="subtitle2" className="mb-2">Image Preview:</Typography>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Add />}
                    disabled={loading}
                    size="large"
                  >
                    {loading ? 'Adding Product...' : 'Add Product'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Products List */}
          <Typography variant="h5" className="mb-4 font-semibold">
            Manage Products ({products.length})
          </Typography>

          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card elevation={2}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="object-cover"
                  />
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      {product.description.length > 100
                        ? product.description.substring(0, 100) + '...'
                        : product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" className="font-bold mb-2">
                      ${product.price}
                    </Typography>
                    <Box className="flex items-center justify-between mb-3">
                      <Chip
                        label={`Stock: ${product.stock}`}
                        color={product.stock > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Box className="flex gap-2">
                      <IconButton
                        color="primary"
                        onClick={() => startEditProduct(product)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteProduct(product.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 1 && (
        <div>
          <Typography variant="h5" className="mb-4 font-semibold">
            Order Management ({orders.length})
          </Typography>

          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.user_name}</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'completed' ? 'success' :
                          order.status === 'shipping' ? 'primary' :
                          order.status === 'cancelled' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" style={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="shipping">Shipping</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 2 && (
        <div>
          <Typography variant="h5" className="mb-4 font-semibold">
            User Management ({users.length})
          </Typography>

          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onClose={cancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <form onSubmit={updateProduct}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={editForm.image_url}
                  onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                />
              </Grid>

              {/* Edit Image Upload */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  ref={editFileInputRef}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => editFileInputRef.current.click()}
                  fullWidth
                >
                  Change Product Image
                </Button>

                {editImagePreview && (
                  <Box className="mt-4">
                    <Typography variant="subtitle2" className="mb-2">Image Preview:</Typography>
                    <img
                      src={editImagePreview}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelEdit} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
