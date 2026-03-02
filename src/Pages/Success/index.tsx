import { BsFillPatchCheckFill } from "react-icons/bs";

const Success: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center space-y-6 shadow-lg">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <BsFillPatchCheckFill className="text-green-600 text-6xl" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          התשלום התקבל בהצלחה!
        </h1>

        <p className="text-gray-600">
          תודה על ההזמנה. אישור ישלח לאימייל שלך בהקדם.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          חזור לדף הבית
        </button>
      </div>
    </div>
  );
};

export default Success;
