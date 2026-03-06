import React, { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginAdmin } from "../../api/admin";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginAdmin({ email, password });

      onLogin?.();

      // Navigate to admin panel
      navigate("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-blue-500 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">פאנל ניהול</h1>
          <p className="text-red-100 mt-2 text-sm">כניסה למערכת הניהול</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                כתובת אימייל
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-right"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                סיסמה
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-right"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-500 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "מתחבר..." : "התחברות"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
