import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  LogOut,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "./OrderDetailsModal";
import { getOrders, getOrderStats } from "../../api/orders";
import { verifyAdmin, logoutAdmin } from "../../api/admin";

// Order Data Type from API
interface OrderData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  quantity: number;
  price: number;
  totalAmount: number;
  shippingCost: number;
  transactionId: string;
  paymentStatus: "success" | "failed" | "pending";
  orderSource: "main_checkout" | "upsell" | "downsell";
  isUpsell: boolean;
  isDownsell: boolean;
  originalOrderId?: string;
  marketingEmails: boolean;
  marketingSMS: boolean;
  createdAt: string;
  updatedAt: string;
}


interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const navigate = useNavigate();
  
  // Statistics state
  const [stats, setStats] = useState({
    totalOrders: 0,
    monthlyIncome: 0,
    newCustomers: 0,
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      await verifyAdmin();
    } catch (error) {
      console.error('Authentication failed:', error);
      navigate('/login');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOrderStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * limit;
      const response = await getOrders({
        search: searchTerm || undefined,
        limit,
        skip,
      });
      setOrders(response.orders);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      onLogout?.();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      navigate('/login');
    }
  };

  const handleViewDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = [
      "מזהה הזמנה",
      "תאריך",
      "שם פרטי",
      "שם משפחה",
      "אימייל",
      "טלפון",
      "מדינה",
      "עיר",
      "כתובת",
      "מיקוד",
      "כמות",
      "מחיר ליחידה",
      "סכום כולל",
      "עלות משלוח",
      "מקור הזמנה",
      "סטטוס",
    ];

    const rows = orders.map((order) => [
      order.transactionId,
      new Date(order.createdAt).toLocaleDateString('he-IL'),
      order.firstName,
      order.lastName,
      order.email,
      order.phoneNumber,
      order.country,
      order.city,
      order.streetAddress,
      order.postalCode,
      order.quantity.toString(),
      order.price.toString(),
      order.totalAmount.toString(),
      order.shippingCost.toString(),
      order.orderSource,
      order.paymentStatus,
    ]);

    // Add BOM for Hebrew support in Excel
    const BOM = "\uFEFF";
    const csvContent =
      BOM +
      [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "הושלם";
      case "pending":
        return "ממתין";
      case "failed":
        return "נכשל";
      default:
        return status;
    }
  };

  const getOrderSourceText = (source: string) => {
    switch (source) {
      case "main_checkout":
        return "רכישה ראשית";
      case "upsell":
        return "שדרוג";
      case "downsell":
        return "הנחה";
      default:
        return source;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans" dir="rtl">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="">
                <img src="/images/logo.png" className="max-w-20" alt="" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">לוח בקרה</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                מנהל מערכת
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 cursor-pointer hover:text-[#C73126] transition-colors"
                title="התנתקות"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">סה"כ הזמנות</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalOrders.toLocaleString('he-IL')}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Package size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">הכנסות החודש</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ₪{stats.monthlyIncome.toLocaleString('he-IL')}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">לקוחות חדשים</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.newCustomers.toLocaleString('he-IL')}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar - Filter button removed */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">הזמנות אחרונות</h2>

            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="חיפוש לפי שם או אימייל..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C73126] focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                ייצוא CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    מזהה
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    לקוח
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    פרטי מוצר
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    סכום
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      טוען הזמנות...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      לא נמצאו הזמנות
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {order.firstName} {order.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getOrderSourceText(order.orderSource)} ({order.quantity} יח')
                        </div>
                        <div className="text-sm text-gray-500">
                          סכום: ₪{order.totalAmount}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.city}, {order.streetAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ₪{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(order.paymentStatus)}`}
                        >
                          {getStatusText(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                          title="צפה בפרטים"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              מציג {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, total)} מתוך {total} תוצאות
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasPrevPage}
              >
                הקודם
              </button>
              <span className="text-sm text-gray-600">
                עמוד {currentPage} מתוך {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasNextPage}
              >
                הבא
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminDashboard;
