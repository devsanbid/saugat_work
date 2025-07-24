// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Context Providers
// import { AuthProvider, AuthContext } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { ProductProvider } from './context/ProductContext';
// import { WishlistProvider } from './context/WishlistContext';

// // Common Components
// import ErrorBoundary from './components/common/ErrorBoundary';
// import Header from './components/common/Header';
// import Footer from './components/common/Footer';

// // Admin Layout
// import AdminLayout from './components/admin/Layout';

// // Public Pages
// import HomePage from './pages/user/HomePage';
// import CategoriesPage from './pages/user/CategoriesPage';
// import ProductListingPage from './pages/user/ProductListingPage';
// import ProductDetailsPage from './pages/user/ProductDetailsPage';
// import SearchResultsPage from './pages/user/SearchResultsPage';
// import ContactPage from './pages/user/ContactPage';
// import AboutPage from './pages/AboutPage';
// import PrivacyPage from './pages/PrivacyPage';
// import TermsPage from './pages/TermsPage';
// import ThankYouPage from './pages/ThankYouPage';

// // Authentication Pages
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

// // User Pages
// import CartPage from './pages/user/CartPage';
// import CheckoutPage from './pages/user/CheckoutPage';
// import OrderConfirmationPage from './pages/user/OrderConfirmationPage';
// import ProfilePage from './pages/user/ProfilePage';
// import WishlistPage from './pages/user/WishlistPage';

// // Admin Pages
// import Overview from './pages/admin/Overview';
// import AdminProfile from './pages/admin/AdminProfile';
// import Usermanagement from './pages/admin/Usermanagement';
// import SellerManagement from './pages/admin/SellerManagement';
// import ProductManagements from './pages/admin/ProductManagements';
// import OrderManagement from './pages/admin/OrderManagement';
// import Notificationspage from './pages/admin/Notificationspage';
// import FinancialReportsPage from './pages/admin/FinancialReportsPage';

// // Error Pages
// import NotFoundPage from './components/error/NotFoundPage';

// // Import Styles
// import './styles/globals.css';
// import './styles/animations.css';
// import OverviewPage from './pages/admin/Overview';
// import UserManagementPage from './pages/admin/Usermanagement';
// import NotificationsPage from './pages/admin/Notificationspage';
// import OrderManagementPage from './pages/admin/OrderManagement';
// import ProductManagementPage from './pages/admin/ProductManagements';
// import SellerManagementPage from './pages/admin/SellerManagement';

// // Protected Route Component
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, isAuthenticated } = useContext(AuthContext);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
//   }

//   if (requiredRole && user?.role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// // Public Route Component (redirects authenticated users)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, user } = useContext(AuthContext);

//   if (isAuthenticated) {
//     // Redirect based on user role
//     switch (user?.role) {
//       case 'admin':
//         return <Navigate to="/admin/dashboard" replace />;
//       case 'seller':
//         return <Navigate to="/seller/dashboard" replace />;
//       default:
//         return <Navigate to="/" replace />;
//     }
//   }

//   return children;
// };

// // User Route Wrapper
// const UserRoute = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
//       <main className="flex-1">
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// function App() {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <CartProvider>
//           <WishlistProvider>
//             <ProductProvider>
//               <Router>
//                 <div className="App">
//                   <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={
//                       <UserRoute>
//                         <HomePage />
//                       </UserRoute>
//                     } />
//                     <Route path="/home" element={<Navigate to="/" replace />} />

//                     {/* Product & Category Routes */}
//                     <Route path="/categories" element={
//                       <UserRoute>
//                         <CategoriesPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/products" element={<Navigate to="/categories" replace />} />
//                     <Route path="/products/:category" element={
//                       <UserRoute>
//                         <ProductListingPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/product/:id" element={
//                       <UserRoute>
//                         <ProductDetailsPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/search" element={
//                       <UserRoute>
//                         <SearchResultsPage />
//                       </UserRoute>
//                     } />

//                     {/* Information Pages */}
//                     <Route path="/about" element={
//                       <UserRoute>
//                         <AboutPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/contact" element={
//                       <UserRoute>
//                         <ContactPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/privacy" element={
//                       <UserRoute>
//                         <PrivacyPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/terms" element={
//                       <UserRoute>
//                         <TermsPage />
//                       </UserRoute>
//                     } />
//                     <Route path="/thank-you" element={
//                       <UserRoute>
//                         <ThankYouPage />
//                       </UserRoute>
//                     } />

//                     {/* Authentication Routes (Public Only) */}
//                     <Route path="/login" element={
//                       <PublicRoute>
//                         <LoginPage />
//                       </PublicRoute>
//                     } />
//                     <Route path="/register" element={
//                       <PublicRoute>
//                         <RegisterPage />
//                       </PublicRoute>
//                     } />
//                     <Route path="/signup" element={<Navigate to="/register" replace />} />
//                     <Route path="/signin" element={<Navigate to="/login" replace />} />

//                     {/* Protected Customer Routes */}
//                     <Route path="/cart" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <CartPage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />
//                     <Route path="/checkout" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <CheckoutPage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />
//                     <Route path="/order-confirmation" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <OrderConfirmationPage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />
//                     <Route path="/profile" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <ProfilePage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />
//                     <Route path="/account" element={<Navigate to="/profile" replace />} />
//                     <Route path="/wishlist" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <WishlistPage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />
//                     <Route path="/favorites" element={<Navigate to="/wishlist" replace />} />
//                     <Route path="/orders" element={
//                       <ProtectedRoute>
//                         <UserRoute>
//                           <ProfilePage />
//                         </UserRoute>
//                       </ProtectedRoute>
//                     } />

                 
//                     <Route path="/admin" element={<AdminLayout/>}>
//                       <Route path="dashboard" element={<Overview />} />
//                       <Route path="profile" element={<AdminProfile />} />
//                       <Route path="usermanagement" element={<Usermanagement />} />
//                       <Route path="sellermanagement" element={<SellerManagement />} />
//                       <Route path="productmanagements" element={<ProductManagements />} />
//                       <Route path="ordermanagement" element={<OrderManagement />} />
//                       <Route path="notifications" element={<Notificationspage />} />
//                       <Route path="financialreports" element={<FinancialReportsPage />} />
//                     </Route>


                 
           
                  


//                     {/* Category Specific Routes */}
//                     <Route path="/musical-instruments" element={<Navigate to="/products/musical-instruments" replace />} />
//                     <Route path="/handicrafts" element={<Navigate to="/products/handicrafts" replace />} />
//                     <Route path="/clothing" element={<Navigate to="/products/clothing" replace />} />
//                     <Route path="/tools-crafts" element={<Navigate to="/products/tools-crafts" replace />} />
//                     <Route path="/grocery" element={<Navigate to="/products/grocery" replace />} />

//                     {/* Seller Routes (Future Implementation) */}
//                     <Route path="/seller/*" element={
//                       <ProtectedRoute requiredRole="seller">
//                         <div className="min-h-screen flex items-center justify-center">
//                           <div className="text-center">
//                             <h1 className="text-3xl font-bold text-gray-900 mb-4">Seller Dashboard</h1>
//                             <p className="text-lg text-gray-600 mb-8">
//                               🚧 Seller panel coming soon...
//                             </p>
//                             <div className="text-6xl mb-4">🛍️</div>
//                           </div>
//                         </div>
//                       </ProtectedRoute>
//                     } />

//                     {/* Legacy/Alternative Route Names */}
//                     <Route path="/shop" element={<Navigate to="/categories" replace />} />
//                     <Route path="/store" element={<Navigate to="/categories" replace />} />
//                     <Route path="/basket" element={<Navigate to="/cart" replace />} />
//                     <Route path="/bag" element={<Navigate to="/cart" replace />} />
//                     <Route path="/payment" element={<Navigate to="/checkout" replace />} />
//                     <Route path="/success" element={<Navigate to="/thank-you" replace />} />

//                     {/* Admin Alternative Routes */}
//                     <Route path="/administration" element={<Navigate to="/admin/overview" replace />} />
//                     <Route path="/management" element={<Navigate to="/admin/overview" replace />} />

//                     {/* 404 - Catch-all route */}
//                     <Route path="*" element={
//                       <UserRoute>
//                         <NotFoundPage />
//                       </UserRoute>
//                     } />
//                   </Routes>
//                 </div>
//               </Router>
//             </ProductProvider>
//           </WishlistProvider>
//         </CartProvider>
//       </AuthProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;





import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Layout Components
import AdminLayout from './components/admin/Layout';
import SellerLayout from './components/layout/SellerLayout';

// Public Pages
import HomePage from './pages/user/HomePage';
import CategoriesPage from './pages/user/CategoriesPage';
import ProductListingPage from './pages/user/ProductListingPage';
import ProductDetailsPage from './pages/user/ProductDetailsPage';
import SearchResultsPage from './pages/user/SearchResultsPage';
import ContactPage from './pages/user/ContactPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';

// Authentication Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderConfirmationPage from './pages/user/OrderConfirmationPage';
import ProfilePage from './pages/user/ProfilePage';
import WishlistPage from './pages/user/WishlistPage';
import OrdersPage from './pages/user/OrdersPage';

// Admin Pages
import Overview from './pages/admin/Overview';
import AdminProfile from './pages/admin/AdminProfile';
import Usermanagement from './pages/admin/Usermanagement';
import SellerManagement from './pages/admin/SellerManagement';
import ProductManagements from './pages/admin/ProductManagements';
import OrderManagement from './pages/admin/OrderManagement';
import Notificationspage from './pages/admin/Notificationspage';
import FinancialReportsPage from './pages/admin/FinancialReportsPage';

// Seller Pages
import SellerDashboard from './pages/seller/pages/Dashboard';
import SellerProducts from './pages/seller/pages/Products';
import SellerOrders from './pages/seller/pages/Orders';
import SellerAnalytics from './pages/seller/pages/Analytics';
import SellerCustomers from './pages/seller/pages/Customers';
import SellerSettings from './pages/seller/pages/Settings';

// Error Pages
import NotFoundPage from './components/error/NotFoundPage';

// Import Styles
import './styles/globals.css';
import './styles/animations.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect based on user role
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'seller':
        return <Navigate to="/seller/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// User Route Wrapper
const UserRoute = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ProductProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                      <UserRoute>
                        <HomePage />
                      </UserRoute>
                    } />
                    <Route path="/home" element={<Navigate to="/" replace />} />

                    {/* Product & Category Routes */}
                    <Route path="/categories" element={
                      <UserRoute>
                        <CategoriesPage />
                      </UserRoute>
                    } />
                    <Route path="/products" element={<Navigate to="/categories" replace />} />
                    <Route path="/products/:category" element={
                      <UserRoute>
                        <ProductListingPage />
                      </UserRoute>
                    } />
                    <Route path="/product/:id" element={
                      <UserRoute>
                        <ProductDetailsPage />
                      </UserRoute>
                    } />
                    <Route path="/search" element={
                      <UserRoute>
                        <SearchResultsPage />
                      </UserRoute>
                    } />

                    {/* Information Pages */}
                    <Route path="/about" element={
                      <UserRoute>
                        <AboutPage />
                      </UserRoute>
                    } />
                    <Route path="/contact" element={
                      <UserRoute>
                        <ContactPage />
                      </UserRoute>
                    } />
                    <Route path="/privacy" element={
                      <UserRoute>
                        <PrivacyPage />
                      </UserRoute>
                    } />
                    <Route path="/terms" element={
                      <UserRoute>
                        <TermsPage />
                      </UserRoute>
                    } />
                    <Route path="/thank-you" element={
                      <UserRoute>
                        <ThankYouPage />
                      </UserRoute>
                    } />

                    {/* Authentication Routes (Public Only) */}
                    <Route path="/login" element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    } />
                    <Route path="/register" element={
                      <PublicRoute>
                        <RegisterPage />
                      </PublicRoute>
                    } />
                    <Route path="/signup" element={<Navigate to="/register" replace />} />
                    <Route path="/signin" element={<Navigate to="/login" replace />} />

                    {/* Protected Customer Routes with /user prefix */}
                    <Route path="/user" element={
                      <ProtectedRoute>
                        <UserRoute>
                          <Outlet />
                        </UserRoute>
                      </ProtectedRoute>
                    }>
                      <Route path="products" element={<ProductListingPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="wishlist" element={<WishlistPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                    </Route>
                    
                    {/* Legacy redirects for backward compatibility */}
                    <Route path="/cart" element={<Navigate to="/user/cart" replace />} />
                    <Route path="/checkout" element={<Navigate to="/user/checkout" replace />} />
                    <Route path="/order-confirmation" element={<Navigate to="/user/order-confirmation" replace />} />
                    <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
                    <Route path="/account" element={<Navigate to="/user/profile" replace />} />
                    <Route path="/wishlist" element={<Navigate to="/user/wishlist" replace />} />
                    <Route path="/favorites" element={<Navigate to="/user/wishlist" replace />} />
                    <Route path="/orders" element={<Navigate to="/user/orders" replace />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Overview />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="usermanagement" element={<Usermanagement />} />
                      <Route path="sellermanagement" element={<SellerManagement />} />
                      <Route path="productmanagements" element={<ProductManagements />} />
                      <Route path="ordermanagement" element={<OrderManagement />} />
                      <Route path="notifications" element={<Notificationspage />} />
                      <Route path="financialreports" element={<FinancialReportsPage />} />
                    </Route>

                    {/* Seller Routes */}
                    <Route path="/seller" element={
                      <ProtectedRoute requiredRole="seller">
                        <SellerLayout />
                      </ProtectedRoute>
                    }>
                      <Route path="dashboard" element={<SellerDashboard />} />
                      <Route path="products" element={<SellerProducts />} />
                      <Route path="orders" element={<SellerOrders />} />
                      <Route path="analytics" element={<SellerAnalytics />} />
                      <Route path="customers" element={<SellerCustomers />} />
                      <Route path="settings" element={<SellerSettings />} />
                    </Route>

                    {/* Category Specific Routes */}
                    <Route path="/musical-instruments" element={<Navigate to="/products/musical-instruments" replace />} />
                    <Route path="/handicrafts" element={<Navigate to="/products/handicrafts" replace />} />
                    <Route path="/clothing" element={<Navigate to="/products/clothing" replace />} />
                    <Route path="/tools-crafts" element={<Navigate to="/products/tools-crafts" replace />} />
                    <Route path="/grocery" element={<Navigate to="/products/grocery" replace />} />

                    {/* Legacy/Alternative Route Names */}
                    <Route path="/shop" element={<Navigate to="/categories" replace />} />
                    <Route path="/store" element={<Navigate to="/categories" replace />} />
                    <Route path="/basket" element={<Navigate to="/cart" replace />} />
                    <Route path="/bag" element={<Navigate to="/cart" replace />} />
                    <Route path="/payment" element={<Navigate to="/checkout" replace />} />
                    <Route path="/success" element={<Navigate to="/thank-you" replace />} />

                    {/* Admin Alternative Routes */}
                    <Route path="/administration" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/management" element={<Navigate to="/admin/dashboard" replace />} />

                    {/* 404 - Catch-all route */}
                    <Route path="*" element={
                      <UserRoute>
                        <NotFoundPage />
                      </UserRoute>
                    } />
                  </Routes>
                </div>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </Router>
            </ProductProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
