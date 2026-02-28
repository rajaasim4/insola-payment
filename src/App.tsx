import { Toaster } from "sonner";
import Order from "./Pages/Order";
import { Route, Routes } from "react-router-dom";
import Success from "./Pages/Success";
import PaymentError from "./Pages/PaymentError";

function App() {
  return (
    <>
      <div dir="rtl" lang="he" className="min-h-screen bg-white font-sans">
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Order />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<PaymentError />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
