import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  PrinterIcon, 
  ArrowDownTrayIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
  StarIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
    } else {
      // Redirect to home if no order data
      navigate('/');
    }
  }, [location.state, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Create receipt HTML
    const receiptHTML = generateReceiptHTML();
    
    // Create blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Doko-Receipt-${order.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Doko Receipt - ${order.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { color: #dc2626; font-size: 24px; font-weight: bold; }
          .order-details { margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .total-section { background: #f9fafb; padding: 15px; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🧺 Doko - Authentic Nepal</div>
          <h2>Order Receipt</h2>
        </div>
        
        <div class="order-details">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${formatDate(order.orderDate)}</p>
          <p><strong>Customer:</strong> ${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
          <p><strong>Email:</strong> ${order.customerInfo.email}</p>
          <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
        </div>

        <div class="order-details">
          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress.address}</p>
          <p>${order.deliveryAddress.city}, ${order.deliveryAddress.district}</p>
          <p>${order.deliveryAddress.zone} Zone, Nepal</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <p><strong>Subtotal:</strong> ${formatPrice(order.payment.subtotal)}</p>
          <p><strong>Shipping:</strong> ${order.payment.shipping === 0 ? 'Free' : formatPrice(order.payment.shipping)}</p>
          <p><strong>Total:</strong> ${formatPrice(order.payment.total)}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Doko!</p>
          <p>Supporting Nepali artisans and preserving cultural heritage</p>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading order confirmation..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 opacity-50">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your order information.</p>
          <Button variant="nepal" onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <CheckCircleIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              🎉 धन्यवाद! Order Confirmed!
            </h1>
            <p className="text-xl text-green-100 mb-2">
              Your order has been successfully placed
            </p>
            <p className="text-green-200">
              Order ID: <span className="font-bold">{order.orderId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Order Status Card */}
          <Card className="mb-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Status
                </h2>
                <p className="text-gray-600">
                  Placed on {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Badge variant="warning" size="lg" className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  <span>Processing</span>
                </Badge>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-sm text-gray-500">
                    We're preparing your order
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-600">Shipped</p>
                  <p className="text-sm text-gray-500">
                    Will be updated soon
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-600">Delivered</p>
                  <p className="text-sm text-gray-500">
                    Expected by {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Customer & Delivery Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                  <p className="text-gray-700">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📧 {order.customerInfo.email}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📞 {order.customerInfo.phone}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <div className="text-gray-700 space-y-1">
                    <p>{order.deliveryAddress.address}</p>
                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.district}</p>
                    <p>{order.deliveryAddress.zone} Zone, Nepal</p>
                    {order.deliveryAddress.landmark && (
                      <p className="text-sm text-gray-500">
                        Landmark: {order.deliveryAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(order.payment.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {order.payment.shipping === 0 ? 'Free' : formatPrice(order.payment.shipping)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(order.payment.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center hidden">
                      <span className="text-2xl opacity-50">🎨</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Category: {item.category?.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <Button
                  variant="nepal"
                  onClick={handlePrint}
                  className="flex items-center space-x-2"
                >
                  <PrinterIcon className="h-4 w-4" />
                  <span>Print Receipt</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download Receipt</span>
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <Link to="/orders">
                  <Button variant="outline">
                    View All Orders
                  </Button>
                </Link>
                
                <Link to="/categories">
                  <Button variant="nepal">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cultural Message */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🇳🇵 धन्यवाद! Thank You!
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Your purchase supports skilled Nepali artisans and helps preserve traditional craftsmanship. 
              You're not just buying products - you're supporting a cultural legacy that has been passed down through generations.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h4>
            <p className="text-gray-600 mb-6">
              Have questions about your order? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>Call Support</span>
              </Button>
              <Link to="/contact">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>Email Support</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
