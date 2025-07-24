import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { categoryAPI } from '../../utils/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');

  // Categories data with detailed information
  const categoriesData = [
    {
      id: 'musical-instruments',
      name: 'Musical Instruments',
      nepaliName: 'संगीत वाद्ययन्त्र',
      description: 'Authentic traditional Nepali musical instruments crafted by skilled artisans',
      longDescription: 'Discover the rich musical heritage of Nepal with our collection of traditional instruments. From the melodious Sarangi to the rhythmic Madal, each instrument is handcrafted by skilled artisans using traditional techniques passed down through generations.',
      image: '/api/placeholder/400/300',
      icon: '🎵',
      productCount: 45,
      averageRating: 4.8,
      priceRange: 'Rs. 500 - Rs. 25,000',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      subcategories: [
        'Sarangi', 'Bansuri', 'Tabla', 'Madal', 'Damphu', 'Tungna', 'Arbajo', 'Dhyango'
      ],
      features: [
        'Handcrafted by master artisans',
        'Traditional techniques preserved',
        'Authentic sound quality',
        'Various sizes available'
      ],
      isPopular: true,
      isNew: false
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts',
      nepaliName: 'हस्तकला',
      description: 'Beautiful handmade crafts representing Nepal\'s artistic heritage',
      longDescription: 'Explore Nepal\'s rich artistic tradition through our curated collection of handicrafts. Each piece tells a story of skilled craftsmanship, cultural significance, and artistic expression that has been refined over centuries.',
      image: '/api/placeholder/400/300',
      icon: '🎨',
      productCount: 78,
      averageRating: 4.9,
      priceRange: 'Rs. 200 - Rs. 50,000',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      subcategories: [
        'Thanka Paintings', 'Wood Carvings', 'Metal Crafts', 'Pottery', 'Singing Bowls', 'Paper Crafts'
      ],
      features: [
        'Authentic cultural designs',
        'Premium quality materials',
        'Unique artistic expressions',
        'Perfect for home decor'
      ],
      isPopular: true,
      isNew: false
    },
    {
      id: 'grocery',
      name: 'Nepali Grocery',
      nepaliName: 'नेपाली किराना',
      description: 'Traditional Nepali food items and organic produce',
      longDescription: 'Taste the authentic flavors of Nepal with our selection of traditional food items. From organic honey to traditional spices, we bring you the finest Nepali grocery items sourced directly from local farmers and producers.',
      image: '/api/placeholder/400/300',
      icon: '🥘',
      productCount: 89,
      averageRating: 4.7,
      priceRange: 'Rs. 100 - Rs. 5,000',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      subcategories: [
        'Ghee', 'Honey', 'Nepali Tea', 'Gundruk', 'Sukuti', 'Chiura', 'Sel Roti Mix'
      ],
      features: [
        'Organic and natural',
        'Traditional recipes',
        'Direct from farmers',
        'Fresh and authentic'
      ],
      isPopular: false,
      isNew: true
    },
    {
      id: 'tools-crafts',
      name: 'Tools & Crafts',
      nepaliName: 'औजार र शिल्प',
      description: 'Traditional tools and utility items for daily use',
      longDescription: 'Discover the practical beauty of traditional Nepali tools and crafts. From the iconic Khukuri to bamboo baskets, these items combine functionality with cultural significance, representing the ingenuity of Nepali craftsmanship.',
      image: '/api/placeholder/400/300',
      icon: '🔧',
      productCount: 34,
      averageRating: 4.6,
      priceRange: 'Rs. 300 - Rs. 15,000',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      subcategories: [
        'Khukuri', 'Kodalo', 'Doko Baskets', 'Bamboo Crafts', 'Nanglo', 'Farming Tools'
      ],
      features: [
        'Durable construction',
        'Traditional designs',
        'Practical utility',
        'Cultural significance'
      ],
      isPopular: false,
      isNew: false
    },
    {
      id: 'clothing',
      name: 'Traditional Clothing',
      nepaliName: 'परम्परागत पोशाक',
      description: 'Authentic Nepali traditional clothing and accessories',
      longDescription: 'Embrace Nepal\'s diverse cultural heritage with our collection of traditional clothing. From the elegant Gunyu Cholo to the iconic Dhaka Topi, each piece represents the rich textile traditions of different ethnic communities in Nepal.',
      image: '/api/placeholder/400/300',
      icon: '👘',
      productCount: 56,
      averageRating: 4.8,
      priceRange: 'Rs. 800 - Rs. 20,000',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      subcategories: [
        'Daura Suruwal', 'Gunyu Cholo', 'Dhaka Topi', 'Bhadgaule Cap', 'Limbu Dress', 'Sherpa Dress'
      ],
      features: [
        'Authentic cultural wear',
        'High-quality fabrics',
        'Traditional patterns',
        'Various ethnic styles'
      ],
      isPopular: true,
      isNew: false
    }
  ];

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryAPI.getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.nepaliName.includes(searchTerm) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popularity':
        return b.productCount - a.productCount;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'newest':
        return b.isNew - a.isNew;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Explore Categories
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-yellow-200">
              श्रेणीहरू अन्वेषण गर्नुहोस् - Discover Nepal's Heritage
            </p>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto">
              Browse through our carefully curated categories of authentic Nepali products.
              Each category represents a unique aspect of Nepal's rich cultural heritage and traditional craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="w-full lg:w-1/2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search categories..."
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="name">Name</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Info */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCategories.length} Categories Found
              </h2>
              <p className="text-gray-600">
                {searchTerm ? `Results for "${searchTerm}"` : 'All product categories'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="success" className="flex items-center space-x-1">
                <SparklesIcon className="h-4 w-4" />
                <span>100% Authentic</span>
              </Badge>
            </div>
          </div>

          {/* Categories Grid/List */}
          <div className={`${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }`}>
            {sortedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button
                variant="nepal"
                onClick={() => setSearchTerm('')}
              >
                Show All Categories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Cultural Info Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nepal's Cultural Heritage in Every Category
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Each category represents centuries of tradition, skill, and cultural significance.
              From musical instruments that have accompanied festivals for generations to handicrafts
              that tell stories of our ancestors, every product connects you to Nepal's rich heritage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">500+</div>
                <div className="text-gray-600">Skilled Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Districts Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Authentic Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, viewMode }) => {
  const [imageError, setImageError] = useState(false);

  if (viewMode === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            {!imageError ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full ${category.bgColor} flex items-center justify-center`}>
                <span className="text-4xl opacity-50">{category.icon}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              <span className="text-lg text-gray-500">{category.nepaliName}</span>
              {category.isPopular && (
                <Badge variant="success" size="sm">Popular</Badge>
              )}
              {category.isNew && (
                <Badge variant="primary" size="sm">New</Badge>
              )}
            </div>

            <p className="text-gray-600 mb-3">{category.description}</p>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{category.averageRating}</span>
              </div>
              <span className="text-sm text-gray-500">{category.productCount} products</span>
              <span className="text-sm text-gray-500">{category.priceRange}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {category.subcategories.slice(0, 4).map((sub, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {sub}
                </Badge>
              ))}
              {category.subcategories.length > 4 && (
                <Badge variant="outline" size="sm">
                  +{category.subcategories.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link to={`/products/${category.id}`}>
              <Button variant="nepal" size="sm" className="flex items-center space-x-2">
                <span>Explore</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link to={`/products/${category.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full ${category.bgColor} flex items-center justify-center`}>
              <span className="text-6xl opacity-50">{category.icon}</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {category.isPopular && (
              <Badge variant="success" size="sm">Popular</Badge>
            )}
            {category.isNew && (
              <Badge variant="primary" size="sm">New</Badge>
            )}
          </div>

          {/* Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center space-x-1">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{category.averageRating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">{category.nepaliName}</p>
          <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{category.productCount} products</span>
            <span className="text-sm font-medium text-gray-700">{category.priceRange}</span>
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-1 mb-4">
            {category.subcategories.slice(0, 3).map((sub, index) => (
              <Badge key={index} variant="outline" size="sm">
                {sub}
              </Badge>
            ))}
            {category.subcategories.length > 3 && (
              <Badge variant="outline" size="sm">
                +{category.subcategories.length - 3}
              </Badge>
            )}
          </div>

          {/* Features */}
          <div className="space-y-1 mb-4">
            {category.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            variant="nepal"
            size="sm"
            fullWidth
            className="group-hover:scale-105 transition-transform"
          >
            Explore Category
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default CategoriesPage;
