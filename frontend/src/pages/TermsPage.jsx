import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ScaleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon,
  GlobeAltIcon,
  CalendarIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: DocumentTextIcon },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: HandRaisedIcon },
    { id: 'user-accounts', title: 'User Accounts', icon: UserIcon },
    { id: 'products-services', title: 'Products & Services', icon: CheckCircleIcon },
    { id: 'orders-payment', title: 'Orders & Payment', icon: CreditCardIcon },
    { id: 'shipping-delivery', title: 'Shipping & Delivery', icon: TruckIcon },
    { id: 'returns-refunds', title: 'Returns & Refunds', icon: ScaleIcon },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: ShieldCheckIcon },
    { id: 'prohibited-uses', title: 'Prohibited Uses', icon: ExclamationTriangleIcon },
    { id: 'limitation-liability', title: 'Limitation of Liability', icon: InformationCircleIcon },
    { id: 'governing-law', title: 'Governing Law', icon: GlobeAltIcon },
    { id: 'contact', title: 'Contact Information', icon: InformationCircleIcon }
  ];

  const lastUpdated = 'July 16, 2025';
  const effectiveDate = 'July 16, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              नियम र शर्तहरू - Terms of Service
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              These terms govern your use of Doko's platform and services. By accessing or using our website, 
              you agree to be bound by these terms and conditions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="success" className="bg-green-500 text-white">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Effective: {effectiveDate}
              </Badge>
              <Badge variant="success" className="bg-blue-500 text-white">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Last Updated: {lastUpdated}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <DocumentTextIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Terms and Conditions Overview</h2>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Important Legal Agreement</h3>
                          <p className="text-blue-800">
                            These Terms and Conditions constitute a legal agreement between you and Doko. 
                            Please read them carefully before using our services.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        Welcome to Doko, Nepal's premier e-commerce platform for authentic traditional products. 
                        These Terms and Conditions ("Terms") govern your access to and use of our website, 
                        mobile application, and services.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Key Points</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>By using Doko, you agree to these terms in full</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>You must be 18 years or older to make purchases</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>All products are authentic Nepali crafts</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>We reserve the right to modify these terms</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Acceptance Section */}
                {activeSection === 'acceptance' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <HandRaisedIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Acceptance of Terms</h2>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-yellow-900 mb-2">Binding Agreement</h3>
                          <p className="text-yellow-800">
                            By accessing or using Doko's services, you acknowledge that you have read, 
                            understood, and agree to be bound by these Terms and Conditions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Agreement</h3>
                        <div className="prose prose-lg max-w-none text-gray-700">
                          <p>
                            By using our website, mobile application, or services, you represent and warrant that:
                          </p>
                          <ul className="mt-4 space-y-2">
                            <li>• You are at least 18 years of age or have reached the age of majority in your jurisdiction</li>
                            <li>• You have the legal capacity to enter into binding agreements</li>
                            <li>• You will use our services in compliance with all applicable laws</li>
                            <li>• The information you provide is accurate and complete</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Modifications</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <p className="text-gray-700">
                            We reserve the right to modify these Terms at any time. Changes will be effective 
                            immediately upon posting on our website. Your continued use of our services after 
                            any modifications constitutes acceptance of the new terms.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Accounts Section */}
                {activeSection === 'user-accounts' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <UserIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">User Accounts</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Creation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-3">Requirements</h4>
                            <ul className="text-blue-800 space-y-2 text-sm">
                              <li>• Valid email address</li>
                              <li>• Secure password</li>
                              <li>• Accurate personal information</li>
                              <li>• Agree to terms and privacy policy</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-6">
                            <h4 className="font-semibold text-green-900 mb-3">Your Responsibilities</h4>
                            <ul className="text-green-800 space-y-2 text-sm">
                              <li>• Maintain account security</li>
                              <li>• Keep information updated</li>
                              <li>• Notify us of unauthorized access</li>
                              <li>• Use account responsibly</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Termination</h3>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <p className="text-red-800">
                            We reserve the right to suspend or terminate your account if you violate these terms, 
                            engage in fraudulent activity, or misuse our services. You may also close your account 
                            at any time by contacting our support team.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products & Services Section */}
                {activeSection === 'products-services' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <CheckCircleIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Products & Services</h2>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-7 w-7 text-red-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-red-900 mb-2">🇳🇵 Authentic Nepali Products</h3>
                          <p className="text-red-800">
                            All products on Doko are authentic Nepali crafts made by skilled artisans using traditional techniques. 
                            We guarantee the cultural authenticity and quality of every item.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { name: 'Musical Instruments', icon: '🎵', desc: 'Traditional Nepali instruments' },
                            { name: 'Handicrafts', icon: '🎨', desc: 'Handmade artistic crafts' },
                            { name: 'Clothing', icon: '👘', desc: 'Traditional Nepali attire' },
                            { name: 'Tools & Crafts', icon: '🔧', desc: 'Traditional tools and utility items' },
                            { name: 'Grocery', icon: '🥘', desc: 'Traditional Nepali food items' },
                            { name: 'Jewelry', icon: '💍', desc: 'Traditional Nepali jewelry' }
                          ].map((category, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                              <div className="text-3xl mb-2">{category.icon}</div>
                              <h4 className="font-medium text-gray-900">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                          <p className="text-yellow-800">
                            While we strive to provide accurate product descriptions, colors may vary slightly due to 
                            photography and screen settings. Handcrafted items may have natural variations that make 
                            each piece unique.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders & Payment Section */}
                {activeSection === 'orders-payment' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <CreditCardIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Orders & Payment</h2>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-red-600 font-bold">1</span>
                            </div>
                            <h4 className="font-medium text-gray-900">Browse</h4>
                            <p className="text-sm text-gray-600">Select products</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-red-600 font-bold">2</span>
                            </div>
                            <h4 className="font-medium text-gray-900">Cart</h4>
                            <p className="text-sm text-gray-600">Review items</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-red-600 font-bold">3</span>
                            </div>
                            <h4 className="font-medium text-gray-900">Checkout</h4>
                            <p className="text-sm text-gray-600">Enter details</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-red-600 font-bold">4</span>
                            </div>
                            <h4 className="font-medium text-gray-900">Confirm</h4>
                            <p className="text-sm text-gray-600">Complete order</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 rounded-lg p-6">
                            <h4 className="font-semibold text-green-900 mb-3">Cash on Delivery</h4>
                            <ul className="text-green-800 space-y-2 text-sm">
                              <li>• Available in Nepal</li>
                              <li>• Pay when you receive</li>
                              <li>• Valid ID required</li>
                              <li>• Exact change preferred</li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-3">Bank Transfer</h4>
                            <ul className="text-blue-800 space-y-2 text-sm">
                              <li>• Secure bank transfer</li>
                              <li>• Order processed after payment</li>
                              <li>• 2-3 business days</li>
                              <li>• Receipt required</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <p className="text-gray-700 mb-4">
                            All prices are listed in Nepali Rupees (NPR) and include applicable taxes. 
                            Prices may change without notice, but confirmed orders are honored at the original price.
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>Free shipping on orders above Rs. 2,000 in Kathmandu Valley</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping & Delivery Section */}
                {activeSection === 'shipping-delivery' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <TruckIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Shipping & Delivery</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Areas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">🏔️</div>
                            <h4 className="font-medium text-gray-900">Kathmandu Valley</h4>
                            <p className="text-sm text-gray-600">1-2 days delivery</p>
                            <p className="text-sm text-green-600">Free above Rs. 2,000</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">🌄</div>
                            <h4 className="font-medium text-gray-900">Major Cities</h4>
                            <p className="text-sm text-gray-600">3-5 days delivery</p>
                            <p className="text-sm text-blue-600">Rs. 150 shipping</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">🏞️</div>
                            <h4 className="font-medium text-gray-900">Remote Areas</h4>
                            <p className="text-sm text-gray-600">5-7 days delivery</p>
                            <p className="text-sm text-yellow-600">Rs. 250 shipping</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Terms</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start space-x-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Delivery times are estimates and may vary due to weather or other factors</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Someone must be available to receive the package</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Valid ID required for cash on delivery orders</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Fragile items are handled with special care</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Returns & Refunds Section */}
                {activeSection === 'returns-refunds' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <ScaleIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Returns & Refunds</h2>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-green-900 mb-2">30-Day Return Policy</h3>
                          <p className="text-green-800">
                            We offer a 30-day return policy for most items. Products must be unused, 
                            in original packaging, and in the same condition as received.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-3xl mb-2">📧</div>
                            <h4 className="font-medium text-gray-900">Contact Us</h4>
                            <p className="text-sm text-gray-600">Email within 30 days</p>
                          </div>
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-3xl mb-2">📦</div>
                            <h4 className="font-medium text-gray-900">Return Item</h4>
                            <p className="text-sm text-gray-600">Original packaging required</p>
                          </div>
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-3xl mb-2">💰</div>
                            <h4 className="font-medium text-gray-900">Get Refund</h4>
                            <p className="text-sm text-gray-600">5-7 business days</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h3>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <ul className="space-y-2 text-red-800">
                            <li>• Custom or personalized items</li>
                            <li>• Perishable goods (food items)</li>
                            <li>• Items damaged by misuse</li>
                            <li>• Gift cards and vouchers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Section */}
                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <InformationCircleIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
                      <h3 className="font-semibold text-red-900 mb-3">Questions About Terms?</h3>
                      <p className="text-red-800 mb-4">
                        If you have any questions about these Terms and Conditions, please contact us. 
                        We're here to help clarify any concerns you may have.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="nepal">Contact Legal Team</Button>
                        <Button variant="outline">General Support</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Department</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">📧</span>
                            <span className="text-sm">legal@doko.com.np</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">📞</span>
                            <span className="text-sm">+977-1-4567890</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">📍</span>
                            <span className="text-sm">Thamel, Kathmandu, Nepal</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span>9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday:</span>
                            <span>10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday:</span>
                            <span>Closed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Message */}
      <section className="py-12 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🇳🇵 Fair and Transparent Terms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Just as our artisans create with integrity and honesty, we conduct business with transparency and fairness. 
              These terms protect both you and us, ensuring a trustworthy marketplace for authentic Nepali culture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
