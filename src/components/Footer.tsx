const Footer = () => {
  const footerLinks = [
    { label: "יצירת קשר", path: "https://dailyhealthinsider.net/contact-us/" },
    {
      label: "תנאי שימוש",
      path: "https://dailyhealthinsider.net/%d7%aa%d7%a0%d7%90%d7%99-%d7%a9%d7%99%d7%9e%d7%95%d7%a9/",
    },
    {
      label: "מדיניות פרטיות",
      path: "https://dailyhealthinsider.net/privacy-policy/",
    },
    {
      label: "מדיניות משלוחים",
      path: "https://dailyhealthinsider.net/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%9e%d7%a9%d7%9c%d7%95%d7%97%d7%99%d7%9d/",
    },
    {
      label: "מדיניות החזרות וזיכויים",
      path: "https://dailyhealthinsider.net/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%94%d7%97%d7%96%d7%a8%d7%95%d7%aa-%d7%95%d7%94%d7%97%d7%96%d7%a8%d7%99%d7%9d/",
    },
    {
      label: " הצהרת נגישות",
      path: "https://dailyhealthinsider.net/%d7%94%d7%a6%d7%94%d7%a8%d7%aa-%d7%a0%d7%92%d7%99%d7%a9%d7%95%d7%aa/",
    },
  ];

  return (
    <footer className="bg-[#393939] py-10">
      <div className="w-full   mx-auto max-w-5xl flex justify-between md:flex-row flex-col max-md:items-center">
        <img
          src="/images/logo.png"
          alt=""
          className="max-w-50 object-contain"
        />
        <div className="">
          <div className="flex flex-col gap-y-1 max-md:text-center">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                dir="rtl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white duration-300 hover:text-white/80"
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
