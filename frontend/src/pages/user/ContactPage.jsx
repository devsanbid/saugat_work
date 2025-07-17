import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: MapPinIcon,
      title: 'Visit Our Store',
      details: [
        'Thamel, Kathmandu 44600',
        'Near Kathmandu Guest House',
        'Nepal'
      ],
      action: 'Get Directions',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: [
        '+977-1-4567890',
        '+977-9851234567',
        'Available 9 AM - 6 PM'
      ],
      action: 'Call Now',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: [
        'hello@doko.com.np',
        'support@doko.com.np',
        'Response within 24 hours'
      ],
      action: 'Send Email',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      details: [
        'Instant support available',
        'Chat with our team',
        'Mon-Sat: 9 AM - 6 PM'
      ],
      action: 'Start Chat',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: 'Closed' }
  ];

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'product-inquiry', label: 'Product Inquiry' },
    { value: 'order-support', label: 'Order Support' },
    { value: 'delivery-query', label: 'Delivery Query' },
    { value: 'return-exchange', label: 'Return/Exchange' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'artisan-partnership', label: 'Artisan Partnership' },
    { value: 'wholesale-inquiry', label: 'Wholesale Inquiry' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number sent to your email or by visiting your account dashboard.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Custom items may have different terms.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping costs vary by location and weight.'
    },
    {
      question: 'Are all products authentic?',
      answer: 'Yes, all our products are handcrafted by skilled Nepali artisans using traditional techniques.'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
          priority: 'normal'
        });
      } catch (error) {
        toast.error('Sorry, there was an error sending your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">💬</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              सम्पर्क - We're here to help!
            </p>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto">
              Have questions about our authentic Nepali products? Need support with your order? 
              Our friendly team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600">Choose your preferred way to reach us</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${method.bgColor} rounded-full mb-4`}>
                      <Icon className={`h-8 w-8 ${method.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{method.title}</h3>
                    <div className="space-y-1 mb-4">
                      {method.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${method.color} border-current hover:bg-current hover:text-white`}
                    >
                      {method.action}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <PaperAirplaneIcon className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                  </div>



                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        placeholder="Your full name"
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Optional"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>
                    </div>

                    <Input
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      error={errors.subject}
                      placeholder="Brief description of your inquiry"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="flex space-x-4">
                        {[
                          { value: 'low', label: 'Low', color: 'text-green-600' },
                          { value: 'normal', label: 'Normal', color: 'text-blue-600' },
                          { value: 'high', label: 'High', color: 'text-yellow-600' },
                          { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
                        ].map(priority => (
                          <label key={priority.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={formData.priority === priority.value}
                              onChange={(e) => handleInputChange('priority', e.target.value)}
                              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Please describe your inquiry or feedback in detail..."
                        required
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="nepal"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Information & FAQ */}
              <div className="space-y-8">
                {/* Office Hours */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ClockIcon className="h-6 w-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Office Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700">{schedule.day}</span>
                        <span className="font-medium text-gray-900">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* FAQ */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Quick Answers</h3>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" size="sm" fullWidth>
                      View All FAQs
                    </Button>
                  </div>
                </Card>

                {/* Social Media */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <GlobeAltIcon className="h-6 w-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Facebook', icon: '📘', followers: '2.5K' },
                      { name: 'Instagram', icon: '📷', followers: '1.8K' },
                      { name: 'Twitter', icon: '🐦', followers: '900' },
                      { name: 'YouTube', icon: '📺', followers: '1.2K' }
                    ].map((social, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-xl">{social.icon}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{social.name}</div>
                          <div className="text-xs text-gray-500">{social.followers} followers</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Store</h2>
              <p className="text-gray-600">
                आउनुहोस् - Come visit our authentic Nepali products store in Thamel
              </p>
            </div>
            
            <Card className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">Thamel, Kathmandu 44600<br />Near Kathmandu Guest House<br />Nepal</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+977-1-4567890</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">hello@doko.com.np</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="nepal" size="lg" fullWidth>
                      Get Directions
                    </Button>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-red-100 to-blue-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-gray-700">Interactive Map</p>
                      <p className="text-sm text-gray-500">Map integration would be implemented here</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Message */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🇳🇵 We're Here to Help
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Doko, we believe in building lasting relationships with our customers. Whether you have questions 
              about our authentic Nepali products, need assistance with your order, or want to learn more about 
              the cultural significance of our crafts, we're always happy to help.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
