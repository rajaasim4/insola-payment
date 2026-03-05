import { BsFillPatchCheckFill } from "react-icons/bs";

const Header = () => {
  return (
    <div className="h-70 lg:pt-20 relative lg:pb-5 bg-[url('/images/bg.png')] w-full bg-cover bg-center">
      <div className="absolute inset-0 bg-white/30 size-full"></div>
      <div className="w-full   mx-auto max-w-5xl flex justify-between lg:flex-row flex-col relative">
        <div className="lg:w-1/2 max-lg:flex justify-center">
          <img src="/images/logo.png" className="max-w-40 " alt="" />
          <div className="space-y-2.5 font-semibold max-lg:hidden">
            {[
              "טכניקת אקופרסורה מגנטית",
              "נוחות מיידית",
              "עיסוי ותמיכה לכף הרגל",
            ].map((text, i) => (
              <div key={i} className="flex gap-2">
                <BsFillPatchCheckFill className="text-green-400 text-2xl font-bold" />
                <span className="text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 max-lg:flex justify-center">
          <img
            src="/images/product-v4.png"
            className="lg:max-w-90  object-contain w-9/12 lg:w-full h-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
