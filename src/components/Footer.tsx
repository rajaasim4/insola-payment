const Footer = () => {
  const footerLinks = [
    { label: "יצירת קשר", path: "" },
    { label: "תנאי שימוש", path: "" },
    { label: "מדיניות פרטיות", path: "" },
    { label: "מדיניות משלוחים", path: "" },
    { label: "מדיניות החזרות וזיכויים", path: "" },
    { label: "מדיניות קבצי Cookie", path: "" },
  ];
  return (
    <footer className="bg-[#393939] py-10">
      <div className="w-full   mx-auto max-w-5xl flex justify-between">
        <img
          src="/images/logo.png"
          alt=""
          className="max-w-50 object-contain"
        />
        <div className="">
          <div className="flex flex-col gap-y-1">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                dir="rtl"
                className="font-bold text-white duration-300 hover:text-white/50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
