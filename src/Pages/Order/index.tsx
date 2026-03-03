import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Purchases from "./components/Purchases";
import MultiStepForm from "./components/MultiStepForm";

const Order = () => {
  return (
    <div className="">
      {/* Header  */}
      <Header />
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6">
        <a
          href="https://wa.me/972586895089"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/whatsapp.svg"
            className="md:size-14 size-10 animate-pulse"
            alt=""
          />
        </a>
      </div>
      {/* Steps */}
      <div className="bg-gray-100 lg:p-5 p-3">
        <div className="max-w-5xl mx-auto lg:py-10 py-5">
          <MultiStepForm />
        </div>
      </div>
      <Purchases />
      <Footer />
    </div>
  );
};

export default Order;
