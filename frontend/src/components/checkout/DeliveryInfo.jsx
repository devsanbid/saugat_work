import React, { useState } from 'react';
import { 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';

const DeliveryInfo = ({ deliveryAddress, estimatedDelivery }) => {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('anytime');

  const deliveryTimeSlots = [
    { id: 'anytime', label: 'Anytime', description: 'Delivery between 9 AM - 6 PM' },
    { id: 'morning', label: 'Morning (9 AM - 12 PM)', description: 'Best for office deliveries' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 3 PM)', description: 'Standard delivery window' },
    { id: 'evening', label: 'Evening (3 PM - 6 PM)', description: 'After work hours' }
  ];

  const deliveryZones = {
    'Kathmandu': { time: '1-2 days', fee: 0, available: true },
    'Lalitpur': { time: '1-2 days', fee: 0, available: true },
    'Bhaktapur': { time: '1-2 days', fee: 0, available: true },
    'Chitwan': { time: '3-5 days', fee: 150, available: true },
    'Pokhara': { time: '3-5 days', fee: 150, available: true },
    'Biratnagar': { time: '4-6 days', fee: 200, available: true },
    'Nepalgunj': { time: '4-6 days', fee: 200, available: true },
    'Dharan': { time: '4-6 days', fee: 200, available: true }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const getDeliveryInfo = (district) => {
    return deliveryZones[district] || { time: '5-7 days', fee: 250, available: true };
  };

  const deliveryInfo = getDeliveryInfo(deliveryAddress?.district);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <TruckIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Delivery Address */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{deliveryAddress?.address}</p>
                <p>{deliveryAddress?.city}, {deliveryAddress?.district}</p>
                <p>{deliveryAddress?.zone} Zone, Nepal</p>
                {deliveryAddress?.landmark && (
                  <p className="text-gray-500">Near: {deliveryAddress.landmark}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Estimated Delivery</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="info" size="md">
                  {deliveryInfo.time}
                </Badge>
                <Badge variant={deliveryInfo.fee === 0 ? 'success' : 'warning'} size="md">
                  {deliveryInfo.fee === 0 ? 'Free Delivery' : `${formatPrice(deliveryInfo.fee)} fee`}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Orders placed before 2 PM are processed the same day
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Time Preferences */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Preferred Delivery Time</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deliveryTimeSlots.map((slot) => (
              <label
                key={slot.id}
                className={`
                  flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-300
                  ${selectedDeliveryTime === slot.id 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="radio"
                  name="deliveryTime"
                  value={slot.id}
                  checked={selectedDeliveryTime === slot.id}
                  onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{slot.label}</p>
                  <p className="text-xs text-gray-500">{slot.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery Guidelines */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Please ensure someone is available to receive the package</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Valid ID required for cash on delivery orders</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Fragile items are handled with extra care</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contact our support for delivery modifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <PhoneIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Support</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 Delivery Hotline: +977-1-4567890</p>
                <p>📧 Email: delivery@doko.com.np</p>
                <p>🕒 Support Hours: 9 AM - 6 PM (Mon-Sat)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Special Delivery Notes</h4>
          <textarea
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Any special instructions for our delivery team (e.g., gate code, specific location, etc.)"
          />
        </div>

        {/* Nepal Delivery Map Info */}
        <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🇳🇵</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Nepal-wide Delivery</h4>
              <p className="text-sm text-gray-600 mb-2">
                We deliver authentic Nepali products across all major cities and districts in Nepal.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                <div>🏔️ Mountain Regions: 5-7 days</div>
                <div>🏞️ Hill Regions: 3-5 days</div>
                <div>🌾 Terai Regions: 2-4 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
