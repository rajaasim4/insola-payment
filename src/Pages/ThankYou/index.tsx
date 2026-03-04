import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const location = useLocation();
  const transactionId = location.state?.transactionId || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          תודה רבה על הרכישה! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          ההזמנה שלך התקבלה בהצלחה. קבלה נשלחה לאימייל שלך.
        </p>
        <p className="text-sm text-gray-500">
          מספר הזמנה: #{typeof transactionId === 'string' ? transactionId : transactionId.toString()}
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
