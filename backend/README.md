# Doko Backend API

Backend API for Doko - A Nepali E-commerce Platform specializing in authentic handicrafts and traditional products.

## Features

- **User Management**: Registration, authentication, profile management
- **Product Management**: CRUD operations, search, filtering, reviews
- **Category Management**: Hierarchical categories with subcategories
- **Shopping Cart**: Add/remove items, apply coupons, calculate totals
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders, track status, manage fulfillment
- **Admin Dashboard**: Analytics, user management, system monitoring
- **Seller Portal**: Product management, order fulfillment, analytics
- **Payment Integration**: Stripe payment processing
- **File Upload**: Image upload with Cloudinary integration
- **Email Notifications**: Order confirmations, status updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doko-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration values.

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```
   This creates sample data including:
   - Admin user (admin@doko.com / admin123)
   - Sample seller (seller@doko.com / seller123)
   - Categories and sample products

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with auto-reload.

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/:id` - Get user statistics

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/coupon` - Apply coupon

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `POST /api/wishlist/move-to-cart` - Move items to cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/reports` - Generate reports
- `GET /api/admin/system-health` - System health check
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon

### Sellers
- `GET /api/sellers/products` - Get seller products
- `GET /api/sellers/orders` - Get seller orders
- `GET /api/sellers/dashboard` - Seller dashboard stats

## Database Models

### User
- Personal information (name, email, phone)
- Authentication (password, role)
- Address information
- Seller information (for sellers)
- Account status and verification

### Product
- Basic info (name, description, price)
- Category and subcategory
- Seller information
- Stock and availability
- Images and specifications
- Reviews and ratings
- Nepali-specific fields (artisan, district)

### Category
- Hierarchical structure
- Multilingual support (English/Nepali)
- Icons and images
- Subcategories

### Order
- User and shipping information
- Order items with pricing
- Payment and shipping details
- Status tracking
- Timestamps

### Cart & Wishlist
- User-specific collections
- Product references
- Quantities and preferences

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Testing

```bash
npm test
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@doko.com or create an issue in the repository.