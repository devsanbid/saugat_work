import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  LockClosedIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: EyeIcon },
    { id: 'information-collection', title: 'Information We Collect', icon: DocumentTextIcon },
    { id: 'information-usage', title: 'How We Use Information', icon: UserGroupIcon },
    { id: 'information-sharing', title: 'Information Sharing', icon: GlobeAltIcon },
    { id: 'data-security', title: 'Data Security', icon: ShieldCheckIcon },
    { id: 'cookies', title: 'Cookies & Tracking', icon: InformationCircleIcon },
    { id: 'rights', title: 'Your Rights', icon: CheckCircleIcon },
    { id: 'contact', title: 'Contact Us', icon: ExclamationTriangleIcon }
  ];

  const lastUpdated = 'July 16, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              गोपनीयता नीति - Your Privacy Matters
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              At Doko, we respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <div className="mt-8">
              <Badge variant="success" className="bg-green-500 text-white">
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
                      <EyeIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Privacy Policy Overview</h2>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                          <p className="text-blue-800">
                            This Privacy Policy applies to all users of Doko's website and services. 
                            By using our platform, you agree to the collection and use of information 
                            in accordance with this policy.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        Welcome to Doko's Privacy Policy. This document outlines how we collect, use, 
                        protect, and share your personal information when you use our e-commerce platform 
                        dedicated to authentic Nepali products.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">What This Policy Covers</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>Personal information we collect and why</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>How we use your information to improve our services</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>When and how we share information with third parties</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>Your rights and choices regarding your personal data</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>How we protect your information</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Information Collection Section */}
                {activeSection === 'information-collection' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <DocumentTextIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Full name and contact details</li>
                                <li>• Email address and phone number</li>
                                <li>• Account credentials (encrypted)</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Purchase Information</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Billing and shipping addresses</li>
                                <li>• Payment information (tokenized)</li>
                                <li>• Order history and preferences</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Information</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Device Information</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• IP address and location data</li>
                                <li>• Browser type and version</li>
                                <li>• Device type and operating system</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Usage Data</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Pages visited and time spent</li>
                                <li>• Search queries and interactions</li>
                                <li>• Shopping cart and wishlist data</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Information Usage Section */}
                {activeSection === 'information-usage' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <UserGroupIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h3 className="font-semibold text-blue-900 mb-3">Service Delivery</h3>
                          <ul className="text-blue-800 space-y-2 text-sm">
                            <li>• Process and fulfill your orders</li>
                            <li>• Provide customer support</li>
                            <li>• Send order confirmations and updates</li>
                            <li>• Manage your account and preferences</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-6">
                          <h3 className="font-semibold text-green-900 mb-3">Communication</h3>
                          <ul className="text-green-800 space-y-2 text-sm">
                            <li>• Send promotional emails (with consent)</li>
                            <li>• Notify about new products and offers</li>
                            <li>• Newsletter and cultural content</li>
                            <li>• Important policy updates</li>
                          </ul>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-6">
                          <h3 className="font-semibold text-purple-900 mb-3">Improvement</h3>
                          <ul className="text-purple-800 space-y-2 text-sm">
                            <li>• Analyze website usage patterns</li>
                            <li>• Improve product recommendations</li>
                            <li>• Enhance user experience</li>
                            <li>• Develop new features</li>
                          </ul>
                        </div>
                        
                        <div className="bg-yellow-50 rounded-lg p-6">
                          <h3 className="font-semibold text-yellow-900 mb-3">Legal Compliance</h3>
                          <ul className="text-yellow-800 space-y-2 text-sm">
                            <li>• Comply with legal obligations</li>
                            <li>• Prevent fraud and abuse</li>
                            <li>• Resolve disputes</li>
                            <li>• Protect intellectual property</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Security Section */}
                {activeSection === 'data-security' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <ShieldCheckIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
                      <div className="flex items-start space-x-3">
                        <ShieldCheckIcon className="h-7 w-7 text-red-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-red-900 mb-2">🇳🇵 Our Security Commitment</h3>
                          <p className="text-red-800">
                            We implement industry-standard security measures to protect your personal information, 
                            ensuring that your data is as secure as the traditional vaults that protect Nepal's cultural treasures.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Safeguards</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <LockClosedIcon className="h-5 w-5 text-green-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Encryption</h4>
                              <p className="text-sm text-gray-600">All data is encrypted in transit and at rest using industry-standard protocols.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <LockClosedIcon className="h-5 w-5 text-green-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Secure Storage</h4>
                              <p className="text-sm text-gray-600">Your data is stored on secure servers with regular backups and monitoring.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <LockClosedIcon className="h-5 w-5 text-green-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Access Control</h4>
                              <p className="text-sm text-gray-600">Strict access controls ensure only authorized personnel can access your data.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Operational Security</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Regular Audits</h4>
                              <p className="text-sm text-gray-600">We conduct regular security audits and vulnerability assessments.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Staff Training</h4>
                              <p className="text-sm text-gray-600">All team members receive privacy and security training.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">Incident Response</h4>
                              <p className="text-sm text-gray-600">We have procedures in place to quickly respond to any security incidents.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Your Rights Section */}
                {activeSection === 'rights' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <CheckCircleIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Your Privacy Rights</h2>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-3">You Have Control</h3>
                      <p className="text-green-800">
                        You have the right to access, modify, or delete your personal information at any time. 
                        We respect your privacy choices and make it easy to manage your preferences.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Access Your Data</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Request a copy of all personal information we have about you.
                          </p>
                          <Button variant="outline" size="sm">Request Data</Button>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Update Information</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Modify or correct your personal information at any time.
                          </p>
                          <Button variant="outline" size="sm">Update Profile</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Delete Your Account</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Request deletion of your account and associated data.
                          </p>
                          <Button variant="outline" size="sm">Delete Account</Button>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Manage Preferences</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Control how we use your data and communication preferences.
                          </p>
                          <Button variant="outline" size="sm">Manage Settings</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Section */}
                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Contact Us About Privacy</h2>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
                      <h3 className="font-semibold text-red-900 mb-3">Questions or Concerns?</h3>
                      <p className="text-red-800 mb-4">
                        If you have any questions about this Privacy Policy or how we handle your personal information, 
                        please don't hesitate to contact us.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="nepal">Email Privacy Team</Button>
                        <Button variant="outline">Call Support</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Officer</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">📧</span>
                            <span className="text-sm">privacy@doko.com.np</span>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Time</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>Data access requests: 30 days</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>Privacy inquiries: 3-5 business days</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>Urgent matters: 24 hours</span>
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
              🇳🇵 Privacy with Cultural Values
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Just as we honor and preserve Nepal's cultural heritage, we honor and protect your privacy. 
              Your trust is as valuable to us as the authentic crafts we share with the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
