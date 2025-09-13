# E-commerce Website

A full-stack e-commerce website built with React (frontend) and PHP (backend) with MySQL database.

## Features

### User Features
- User registration and login
- Browse products
- View product details
- Add products to cart
- Checkout and place orders
- View order history

### Admin Features
- Admin dashboard
- Product management (CRUD)
- Order management
- User management
- Update order status

## Project Structure

```
shop/
├── frontend/          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── UserOrders.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/           # PHP backend
│   ├── api/
│   │   ├── auth.php
│   │   ├── products.php
│   │   ├── cart.php
│   │   ├── orders.php
│   │   └── users.php
│   ├── config/
│   │   └── db.php
│   └── schema.sql
├── vercel.json        # Vercel deployment config
├── .env.example       # Environment variables template
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js and npm
- PHP 7.4+
- MySQL
- Composer (for PHP dependencies)

### 1. Database Setup
1. Create a MySQL database named `shop_db`
2. Run the SQL script in `backend/schema.sql` to create tables and insert sample data

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies (if using Composer):
   ```bash
   composer install
   ```
3. Configure database connection in `backend/config/db.php`
4. Start PHP server (if not using Apache):
   ```bash
   php -S localhost:8000 -t .
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### 4. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the environment variables with your database credentials and other settings

## API Endpoints

### Authentication
- `POST /api/auth.php?action=register` - User registration
- `POST /api/auth.php?action=login` - User login
- `POST /api/auth.php?action=logout` - User logout

### Products
- `GET /api/products.php` - Get all products
- `GET /api/products.php?id={id}` - Get single product
- `POST /api/products.php` - Add new product (admin)
- `PUT /api/products.php?id={id}` - Update product (admin)
- `DELETE /api/products.php?id={id}` - Delete product (admin)

### Cart
- `GET /api/cart.php` - Get user's cart
- `POST /api/cart.php` - Add item to cart
- `PUT /api/cart.php` - Update cart item quantity
- `DELETE /api/cart.php?product_id={id}` - Remove item from cart

### Orders
- `GET /api/orders.php` - Get user's orders
- `GET /api/orders.php?admin=true` - Get all orders (admin)
- `POST /api/orders.php` - Create new order
- `PUT /api/orders.php?id={id}` - Update order status (admin)

### Users (Admin)
- `GET /api/users.php` - Get all users

## Deployment to Vercel

### Prerequisites
- Vercel account
- Git repository

### Steps
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   vercel
   ```

4. **Configure environment variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables from `.env.example`

5. **Database setup for production**:
   - Use a cloud database service (e.g., PlanetScale, AWS RDS)
   - Update database credentials in environment variables

6. **Update API URLs**:
   - In the frontend code, update API base URLs to point to your Vercel deployment
   - Example: Change `http://localhost/backend/api/` to `https://your-app.vercel.app/api/`

### Vercel Configuration
The `vercel.json` file handles:
- Building the React frontend
- Routing API calls to PHP functions
- Serving static files

### Troubleshooting
- Ensure PHP runtime is supported (vercel-php@0.6.0)
- Check that all dependencies are listed in `package.json`
- Verify environment variables are set correctly
- Test API endpoints after deployment

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- CSS for styling

### Backend
- PHP 7.4+
- MySQL
- PDO for database connection

### Deployment
- Vercel for hosting
- MySQL for database

## Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (User/Admin)
- Input validation and sanitization
- CORS headers

## Sample Data
The database schema includes sample users and products for testing:
- Admin user: admin@example.com / password
- Regular user: john@example.com / password
- Sample products with descriptions and prices

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.
