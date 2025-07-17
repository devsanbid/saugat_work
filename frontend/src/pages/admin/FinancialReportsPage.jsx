import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, CreditCard, PieChart } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const FinancialReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch financial data from backend
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching financial data with params:', { period: selectedPeriod, year: selectedYear });
      const response = await adminAPI.getFinancialReports({
        period: selectedPeriod,
        year: selectedYear
      });
      console.log('Financial data response:', response);
      console.log('Financial data response.data:', response.data);
      setFinancialData(response.data);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod, selectedYear]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading financial reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const financialSummary = financialData?.summary || {
    totalRevenue: 0,
    totalCommission: 0,
    totalPayouts: 0,
    netProfit: 0
  };
  const recentTransactions = financialData?.recentTransactions || [];
  const topSellersByRevenue = financialData?.topSellers || [];
  
  console.log('financialData:', financialData);
  console.log('financialSummary:', financialSummary);
  console.log('recentTransactions:', recentTransactions);
  console.log('topSellersByRevenue:', topSellersByRevenue);

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const FinancialCard = ({ title, amount, color, description, icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(amount)}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <div className="flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinancialCard
            title="Total Revenue"
            amount={financialSummary.totalRevenue}
            color="blue"
            description="Platform total revenue"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <FinancialCard
            title="Commission Earned"
            amount={financialSummary.totalCommission}
            color="green"
            description="From seller transactions"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <FinancialCard
            title="Seller Payouts"
            amount={financialSummary.totalPayouts}
            color="purple"
            description="Paid to sellers"
            icon={<CreditCard className="w-6 h-6" />}
          />
          <FinancialCard
            title="Net Profit"
            amount={financialSummary.netProfit}
            color="yellow"
            description="After all expenses"
            icon={<PieChart className="w-6 h-6" />}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sellers by Revenue</h3>
          <div className="space-y-3">
            {topSellersByRevenue.map((seller, index) => (
              <div key={seller._id || seller.name || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-700">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {seller.businessName || seller.firstName + ' ' + seller.lastName || seller.name || 'Unknown Seller'}
                    </p>
                    <p className="text-xs text-gray-500">{seller.totalOrders || seller.orders || 0} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(seller.totalRevenue || seller.revenue || 0)}</p>
                  <p className="text-xs text-gray-500">Commission: {formatCurrency(seller.totalCommission || seller.commission || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id || transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction._id || transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Commission' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'Payout' ? 'bg-blue-100 text-blue-800' :
                        transaction.type === 'Refund' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.seller || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product Sales</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(110000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Commission</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(15000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Fees</span>
                  <span className="text-sm font-medium text-red-600">-{formatCurrency(2750)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">Net Revenue</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(122250)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Expense Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Seller Payouts</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(110000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Refunds</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(1250)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Chargebacks</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(350)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">Total Expenses</span>
                  <span className="text-sm font-bold text-red-600">{formatCurrency(111600)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FinancialReportsPage;
