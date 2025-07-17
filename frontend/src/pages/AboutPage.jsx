import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    artisans: 0,
    products: 0,
    districts: 0,
    customers: 0
  });

  const finalStats = {
    artisans: 500,
    products: 1000,
    districts: 15,
    customers: 5000
  };

  // Animated counter effect
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Animate counters
      const duration = 2000;
      const steps = 50;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          artisans: Math.floor(finalStats.artisans * progress),
          products: Math.floor(finalStats.products * progress),
          districts: Math.floor(finalStats.districts * progress),
          customers: Math.floor(finalStats.customers * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(finalStats);
        }
      }, interval);
    }, 1000);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const teamMembers = [
    {
      name: 'Saugat Paneru',
      role: 'Founder & CEO',
      bio: 'A passionate advocate for Nepali culture with 15+ years in traditional crafts',
      image: '/api/placeholder/150/150',
      location: 'Kathmandu, Nepal',
      quote: 'Every product tells a story of our heritage'
    },
    {
      name: 'Rajiv Ganeju',
      role: 'Head of Artisan Relations',
      bio: 'Connecting with artisans across Nepal to preserve traditional techniques',
      image: '/api/placeholder/150/150',
      location: 'Bhaktapur, Nepal',
      quote: 'Supporting artisans is supporting our culture'
    },
    {
      name: 'Aayush Yadav',
      role: 'Product Quality Manager',
      bio: 'Ensuring every product meets our high standards of authenticity',
      image: '/api/placeholder/150/150',
      location: 'Pokhara, Nepal',
      quote: 'Quality is our promise to customers'
    },
    {
      name: 'Sandis Prajapati',
      role: 'Cultural Heritage Specialist',
      bio: 'Documenting and preserving the stories behind each craft',
      image: '/api/placeholder/150/150',
      location: 'Lalitpur, Nepal',
      quote: 'Every craft has a soul and a story'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Customer from USA',
      message: 'Doko has brought authentic Nepali culture to my home. The quality is exceptional and the service is outstanding.',
      rating: 5,
      image: '/api/placeholder/80/80'
    },
    {
      name: 'David Chen',
      role: 'Culture Enthusiast',
      message: 'I\'ve been collecting traditional instruments for years. Doko\'s Sarangi is the finest I\'ve ever owned.',
      rating: 5,
      image: '/api/placeholder/80/80'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Art Collector',
      message: 'The Thanka paintings from Doko are masterpieces. You can feel the cultural significance in every brushstroke.',
      rating: 5,
      image: '/api/placeholder/80/80'
    }
  ];

  const achievements = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to preserve and promote Nepali culture globally'
    },
    {
      year: '2021',
      title: 'First 100 Artisans',
      description: 'Partnered with skilled craftspeople across 5 districts'
    },
    {
      year: '2022',
      title: 'International Recognition',
      description: 'Featured in Global Heritage Preservation Initiative'
    },
    {
      year: '2023',
      title: 'Cultural Impact Award',
      description: 'Recognized for outstanding contribution to cultural preservation'
    },
    {
      year: '2024',
      title: '1000+ Products',
      description: 'Reached milestone of 1000 authentic products in catalog'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Serving customers in 25+ countries worldwide'
    }
  ];

  const values = [
    {
      icon: '🎨',
      title: 'Authenticity',
      description: 'Every product is verified for cultural authenticity and traditional craftsmanship techniques.'
    },
    {
      icon: '🤝',
      title: 'Fair Trade',
      description: 'We ensure fair compensation for all artisans and maintain transparent business practices.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Promoting eco-friendly practices and supporting sustainable traditional methods.'
    },
    {
      icon: '📚',
      title: 'Cultural Education',
      description: 'Sharing the stories and cultural significance behind each handcrafted item.'
    },
    {
      icon: '🏔️',
      title: 'Heritage Preservation',
      description: 'Actively working to preserve traditional skills and pass them to future generations.'
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Connecting Nepal\'s rich culture with people around the world through authentic products.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading our story..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🧺</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Doko
            </h1>
            <p className="text-2xl text-blue-100 mb-4">
              हाम्रो कथा - Our Story
            </p>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Born from a deep love for Nepal's rich cultural heritage, Doko connects authentic
              traditional crafts with people worldwide, supporting artisans and preserving ancient techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Our Mission
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                {stats.artisans}+
              </div>
              <div className="text-gray-700 font-medium">Skilled Artisans</div>
              <div className="text-sm text-gray-500">Across Nepal</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stats.products}+
              </div>
              <div className="text-gray-700 font-medium">Authentic Products</div>
              <div className="text-sm text-gray-500">In our catalog</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                {stats.districts}+
              </div>
              <div className="text-gray-700 font-medium">Districts Covered</div>
              <div className="text-sm text-gray-500">Nationwide reach</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
                {stats.customers}+
              </div>
              <div className="text-gray-700 font-medium">Happy Customers</div>
              <div className="text-sm text-gray-500">Globally</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-xl text-gray-600">
                हाम्रो यात्रा - A Journey of Cultural Preservation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-6xl mb-6">🏔️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Born in the Himalayas
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Doko was founded in 2020 by a group of passionate Nepali entrepreneurs who saw
                  traditional crafts disappearing in the digital age. We realized that many skilled
                  artisans were struggling to reach global markets, while people worldwide were
                  seeking authentic, handcrafted products with cultural significance.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our name "Doko" comes from the traditional Nepali woven basket, symbolizing
                  our mission to carry and preserve Nepal's cultural treasures to the world.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Vision</h4>
                  <p className="text-sm text-gray-600">
                    To be the global bridge connecting authentic Nepali crafts with appreciative hearts worldwide.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">💝</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-600">
                    Preserving traditional crafts while providing sustainable livelihoods for skilled artisans.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🌟</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Values</h4>
                  <p className="text-sm text-gray-600">
                    Authenticity, fair trade, sustainability, and cultural education guide everything we do.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🤝</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Promise</h4>
                  <p className="text-sm text-gray-600">
                    Every purchase supports an artisan family and helps preserve ancient techniques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">
                मूल्यहरू - The principles that guide us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                टिम - The passionate people behind Doko
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl hidden">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {member.location}
                  </div>
                  <blockquote className="text-sm italic text-gray-600 border-l-4 border-red-500 pl-4">
                    "{member.quote}"
                  </blockquote>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-xl text-gray-600">
                यात्रा - Milestones in our mission
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 to-blue-600"></div>

              <div className="space-y-12">
                {achievements.map((achievement, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="absolute left-0 w-12 h-12 bg-white border-4 border-red-600 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-20">
                      <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6">
                        <Badge variant="primary" size="sm" className="mb-2">
                          {achievement.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
              <p className="text-xl text-gray-600">
                प्रतिक्रिया - Voices from our community
              </p>
            </div>

            <div className="relative">
              <Card className="p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center text-white font-bold hidden">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                </div>

                <blockquote className="text-lg italic text-gray-700 mb-4 max-w-2xl mx-auto">
                  "{testimonials[activeTestimonial].message}"
                </blockquote>

                <div className="font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonials[activeTestimonial].role}
                </div>
              </Card>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-xl text-gray-600">
                प्रभाव - Making a difference together
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Families Supported</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
                <p className="text-gray-600">
                  Directly supporting artisan families across Nepal through fair trade partnerships.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Skills Preserved</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <p className="text-gray-600">
                  Traditional craft techniques documented and passed to younger generations.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Global Reach</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                <p className="text-gray-600">
                  Countries where we've shared Nepal's cultural heritage through authentic products.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8">
              सहयोग - Help us preserve Nepal's cultural heritage for future generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  Shop Authentic Products
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  Partner With Us
                  <HeartIconSolid className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
