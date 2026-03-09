import { Toaster } from "sonner";
import Order from "./Pages/Order";
import { Route, Routes } from "react-router-dom";
import Success from "./Pages/Success";
import PaymentError from "./Pages/PaymentError";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TagManager from "react-gtm-module";
import { GTM_ID } from "./utils/constants";
import ThankYou from "./Pages/ThankYou";
import LoginPage from "./Pages/Login";
import AdminDashboard from "./Pages/Admin";
import { useEffect } from "react";

function App() {
  const tagManagerArgs = {
    gtmId: GTM_ID,
  };

  TagManager.initialize(tagManagerArgs);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "payment_page_event_add_to_cart",
      },
    });
  }, []);
  return (
    <>
      <div dir="rtl" lang="he" className="min-h-screen bg-white font-sans">
        <Toaster position="top-right" richColors />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Slide}
        />
        <Routes>
          <Route path="/" element={<Order />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<PaymentError />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
