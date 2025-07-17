import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  PrinterIcon, 
  ArrowDownTrayIcon,
  ShareIcon,
  StarIcon,
  GiftIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confetti, setConfetti] = useState(true);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      
      // Show review prompt after 3 seconds
      setTimeout(() => {
        setShowReviewPrompt(true);
      }, 3000);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setConfetti(false);
      }, 5000);
    } else {
      // Redirect to home if no order data
      navigate('/');
    }
  }, [location.state, navigate]);

  // Mock recommended products
  const mockRecommendedProducts = [
    {
      id: 101,
      name: 'Traditional Madal',
      price: 4500,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviewCount: 19,
      category: 'musical-instruments',
      isAuthentic: true,
      stock: 8
    },
    {
      id: 102,
      name: 'Handwoven Dhaka Fabric',
      price: 3200,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 25,
      category: 'clothing',
      isAuthentic: true,
      stock: 12
    },
    {
      id: 103,
      name: 'Singing Bowl Set',
      price: 6500,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 33,
      category: 'handicrafts',
      isAuthentic: true,
      stock: 5
    }
  ];

  useEffect(() => {
    // Simulate loading recommended products
    setTimeout(() => {
      setRecommendedProducts(mockRecommendedProducts);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleSaveReceipt = () => {
    // Create detailed receipt
    const receiptData = {
      orderId: order.orderId,
      date: order.orderDate,
      customer: order.customerInfo,
      items: order.items,
      payment: order.payment,
      delivery: order.deliveryAddress
    };

    // Save to localStorage
    const savedReceipts = JSON.parse(localStorage.getItem('dokoReceipts') || '[]');
    savedReceipts.push(receiptData);
    localStorage.setItem('dokoReceipts', JSON.stringify(savedReceipts));

    // Create downloadable file
    const receiptHTML = generateReceiptHTML();
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Doko-Receipt-${order.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Receipt saved successfully!');
  };

  const generateReceiptHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Doko Receipt - ${order.orderId}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #fef2f2 0%, #eff6ff 100%);
          }
          .receipt-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #dc2626 0%, #2563eb 100%);
            color: white;
            text-align: center; 
            padding: 30px 20px;
          }
          .logo { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .tagline { 
            font-size: 14px; 
            opacity: 0.9;
          }
          .content { 
            padding: 30px;
          }
          .section { 
            margin-bottom: 25px;
          }
          .section h3 { 
            color: #dc2626; 
            border-bottom: 2px solid #dc2626; 
            padding-bottom: 8px; 
            margin-bottom: 15px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 20px;
          }
          .info-item { 
            background: #f9fafb; 
            padding: 15px; 
            border-radius: 8px;
            border-left: 4px solid #dc2626;
          }
          .info-label { 
            font-weight: bold; 
            color: #374151; 
            margin-bottom: 5px;
          }
          .info-value { 
            color: #6b7280;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          .items-table th { 
            background: #f3f4f6; 
            padding: 12px; 
            text-align: left; 
            font-weight: bold;
            color: #374151;
          }
          .items-table td { 
            padding: 12px; 
            border-bottom: 1px solid #e5e7eb;
          }
          .item-name { 
            font-weight: 500; 
            color: #111827;
          }
          .total-section { 
            background: linear-gradient(135deg, #fef2f2 0%, #eff6ff 100%);
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 20px;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px;
          }
          .total-final { 
            font-size: 18px; 
            font-weight: bold; 
            color: #dc2626;
            border-top: 2px solid #dc2626;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
          }
          .cultural-message {
            background: linear-gradient(135deg, #fef2f2 0%, #eff6ff 100%);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .print-only { display: none; }
          @media print {
            body { background: white; }
            .receipt-container { box-shadow: none; }
            .print-only { display: block; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo">🧺 Doko</div>
            <div class="tagline">Authentic Nepal - स्वागतम्</div>
            <div style="margin-top: 15px;">
              <h2 style="margin: 0;">Purchase Receipt</h2>
              <p style="margin: 5px 0;">${order.orderId}</p>
            </div>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Order Date</div>
                <div class="info-value">${new Date(order.orderDate).toLocaleDateString()}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Customer</div>
                <div class="info-value">${order.customerInfo.firstName} ${order.customerInfo.lastName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${order.customerInfo.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${order.customerInfo.phone}</div>
              </div>
            </div>

            <div class="section">
              <h3>Delivery Address</h3>
              <div class="info-item">
                <div class="info-value">
                  ${order.deliveryAddress.address}<br>
                  ${order.deliveryAddress.city}, ${order.deliveryAddress.district}<br>
                  ${order.deliveryAddress.zone} Zone, Nepal
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Items Purchased</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td class="item-name">${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${formatPrice(item.price)}</td>
                      <td>${formatPrice(item.total)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatPrice(order.payment.subtotal)}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>${order.payment.shipping === 0 ? 'Free' : formatPrice(order.payment.shipping)}</span>
              </div>
              <div class="total-row total-final">
                <span>Total Amount:</span>
                <span>${formatPrice(order.payment.total)}</span>
              </div>
              <div style="margin-top: 15px; text-align: center;">
                <strong>Payment Method:</strong> Cash on Delivery
              </div>
            </div>

            <div class="cultural-message">
              <h4 style="color: #dc2626; margin-bottom: 10px;">🇳🇵 धन्यवाद - Thank You!</h4>
              <p style="margin: 0; color: #6b7280;">
                Your purchase supports skilled Nepali artisans and helps preserve traditional craftsmanship. 
                You're not just buying products - you're supporting cultural heritage.
              </p>
            </div>

            <div class="footer">
              <p>Thank you for choosing Doko!</p>
              <p>🌐 www.doko.com.np | 📞 +977-1-4567890 | 📧 hello@doko.com.np</p>
              <p>📍 Thamel, Kathmandu, Nepal</p>
              <div class="print-only">
                <p style="margin-top: 20px;">Receipt generated on: ${currentDate}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Preparing your thank you page..." />
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <span className="text-2xl">
                {['🎉', '🎊', '⭐', '🌟', '✨'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20 relative">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-8 animate-pulse">
              <CheckCircleIcon className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              🎉 धन्यवाद!
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Thank You for Your Order!
            </h2>
            <p className="text-xl text-green-100 mb-6">
              Your support helps preserve Nepal's rich cultural heritage
            </p>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-lg mb-4">
                Order ID: <span className="font-bold text-yellow-200">{order.orderId}</span>
              </p>
              <p className="text-emerald-100">
                Total Amount: <span className="font-bold text-2xl">{formatPrice(order.payment.total)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Order Summary Card */}
          <Card className="mb-8 p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <GiftIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Order is Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                We've received your order and it's being processed by our team.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {order.items.length}
                  </div>
                  <div className="text-sm text-gray-600">Items Ordered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    3-5 Days
                  </div>
                  <div className="text-sm text-gray-600">Delivery Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    COD
                  </div>
                  <div className="text-sm text-gray-600">Payment Method</div>
                </div>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="nepal"
                onClick={handleSaveReceipt}
                className="flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Save Receipt</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center space-x-2"
              >
                <PrinterIcon className="h-4 w-4" />
                <span>Print Receipt</span>
              </Button>
            </div>
          </Card>

          {/* Cultural Impact Message */}
          <Card className="mb-8 p-8 bg-gradient-to-r from-red-50 to-blue-50 border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🇳🇵</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                You're Supporting Nepali Artisans
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Every purchase from Doko directly supports skilled Nepali artisans and their families. 
                Your order helps preserve traditional craftsmanship techniques that have been passed down 
                through generations. You're not just buying products - you're investing in Nepal's cultural heritage.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">👨‍🎨</div>
                  <div className="text-sm font-medium text-gray-900">Skilled Artisans</div>
                  <div className="text-xs text-gray-600">Supporting local craftspeople</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏛️</div>
                  <div className="text-sm font-medium text-gray-900">Cultural Heritage</div>
                  <div className="text-xs text-gray-600">Preserving traditions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-sm font-medium text-gray-900">Global Impact</div>
                  <div className="text-xs text-gray-600">Sharing Nepal worldwide</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Review Prompt */}
          {showReviewPrompt && (
            <Card className="mb-8 p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Love Your Purchase?
                  </h4>
                  <p className="text-gray-600">
                    Share your experience and help other customers discover authentic Nepali products.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                    Write Review
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Recommended Products */}
          <Card className="mb-8 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You Might Also Like
              </h3>
              <p className="text-gray-600">
                Complete your collection with these authentic Nepali products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => {}}
                />
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What's Next?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Order Processing
                </h4>
                <p className="text-gray-600 mb-4">
                  We'll send you email updates as your order is processed and shipped.
                </p>
                <Link to="/orders">
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Keep Shopping
                </h4>
                <p className="text-gray-600 mb-4">
                  Discover more authentic Nepali products and add them to your collection.
                </p>
                <Link to="/categories">
                  <Button variant="nepal" size="sm">
                    Browse More
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Message */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold mb-4">
              नमस्ते! Until We Meet Again
            </h3>
            <p className="text-xl leading-relaxed">
              Thank you for choosing Doko and supporting Nepal's cultural heritage. 
              Your purchase makes a difference in preserving traditional craftsmanship for future generations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
