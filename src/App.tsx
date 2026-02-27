import { Toaster } from "sonner";
import Order from "./Pages/Order";

function App() {
  return (
    <>
      <div dir="rtl" lang="he" className="min-h-screen bg-white font-sans">
        <Toaster position="top-right" richColors />
        <Order />
      </div>
    </>
  );
}

export default App;
