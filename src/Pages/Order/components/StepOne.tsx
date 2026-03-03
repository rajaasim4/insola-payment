import { FaCalendarCheck } from "react-icons/fa";
import type { StepProps } from "../../../types";
import TagManager from "react-gtm-module";

const StepOne: React.FC<StepProps> = ({
  values,
  setFieldValue,
  handleChange,
  errors,
  touched,
}) => {
  const products = [
    {
      id: 4,
      quantity: "4",
      description: "זוגות",
      discount: "70% הנחה",
      originalPrice: "₪996.67",
      discountedPrice: "299.00",
      toplabel: "הכי פופולארי",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/4.png",
    },
    {
      id: 3,
      quantity: "3",
      description: "זוגות",
      discount: "70% הנחה",
      originalPrice: "₪830.00",
      discountedPrice: "249.00",
      toplabel: "",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/3.png",
    },
    {
      id: 2,
      quantity: "2",
      description: "זוגות",
      discount: "70% הנחה",
      originalPrice: "₪563.00",
      discountedPrice: "169.00",
      toplabel: "",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/2.png",
    },
    {
      id: 1,
      quantity: "1",
      description: "זוג",
      discount: "70% הנחה",
      originalPrice: "₪330.00",
      discountedPrice: "99.00",
      toplabel: "",
      bottomLable: "",
      img: "/images/1.png",
    },
  ];

  // Inside your component
  const handleSelectProduct = (item: any) => {
    // Update Formik values
    setFieldValue("selectedProductId", item.id);
    setFieldValue("price", item.discountedPrice);
    setFieldValue("quantity", item.quantity);

    // Push event to TagManager
    TagManager.dataLayer({
      dataLayer: {
        event: "item_added_to_cart",
        price: item.discountedPrice,
        quantity: item.quantity,
      },
    });
  };

  return (
    <div>
      {/* Discount Header */}
      <div className="grid sm:grid-flow-col gap-2 mb-5">
        <div className="">
          <img
            src="/images/off.png"
            className="size-20 object-contain max-sm:mx-auto"
          />
        </div>
        <div className="max-sm:text-center">
          <h4 className="text-xl font-bold text-[#C73126]">
            הנחה בשווי70% חלה על הזמנה זו
          </h4>
          <p className="font-bold mt-1">
            <span className="text-[#C73126]">הצעה לזמן מוגבל בלבד:</span> Insola
            זמין במחיר חסר תקדים ₪92.00 ₪306.67 (70% הנחה ליחידה)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 mb-4">
        <FaCalendarCheck />
        <h2 className="font-bold text-base">שלב 2: בחרו מידה וכמות</h2>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex gap-2 items-center">
          <input
            type="radio"
            name="size"
            className="size-5"
            value="S-M"
            id="small"
            checked={values.size === "S-M"}
            onChange={handleChange}
          />
          <label
            htmlFor="small"
            className={values.size === "S-M" ? "font-bold" : ""}
          >
            <strong>S-M: 36-42</strong>
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="radio"
            name="size"
            className="size-5"
            value="L-XL"
            id="large"
            checked={values.size === "L-XL"}
            onChange={handleChange}
          />
          <label
            htmlFor="large"
            className={values.size === "L-XL" ? "font-bold" : ""}
          >
            <strong>L-XL 42-47</strong>
          </label>
        </div>
        {touched.size && errors.size && (
          <div className="text-red-500 text-sm">{errors.size}</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5  my-10">
        {products.map((item) => {
          return (
            <div
              key={item.id}
              className="rounded-sm cursor-pointer  relative "
              onClick={() => handleSelectProduct(item)}
            >
              <div
                className={`text-white absolute rounded-t-sm -top-5 left-0   font-bold py-1 w-full  text-center text-sm ${item.toplabel !== "" ? "bg-blue-400 h-7" : "bg-transparent"}`}
              >
                {item.toplabel}
              </div>
              <div
                className={`bg-gray-100  py-6 min-h-40 grid grid-cols-2 gap-3 border-2  ${values.selectedProductId === item.id ? "border-blue-400" : "border-transparent"}`}
              >
                <div className="">
                  <img
                    src={item.img}
                    alt=""
                    className="md:w-full w-9/12 object-contain"
                  />
                </div>
                <div className="flex flex-col items-center ">
                  <h3 className="font-bold text-3xl">{item.quantity}x</h3>
                  <h4 className="text-xs font-semibold">{item.description}</h4>
                  <h3 className="text-[#F79E1B] font-semibold">
                    {item.discount}
                  </h3>
                  <h4 className="line-through text-[#b1b2b3]">
                    {item.originalPrice}
                  </h4>
                  <h3 className="text-green-500 text-xl font-bold">
                    ₪{item.discountedPrice}
                  </h3>
                </div>
              </div>
              {/* <div
                className={`text-white h-7 absolute bottom-0 left-0  font-bold  py-1 w-full  text-center text-sm ${item.bottomLable !== "" ? "bg-blue-400" : "bg-transparent"}`}
              >
                {item.bottomLable}
              </div> */}
            </div>
          );
        })}
      </div>
      <label className="flex items-center gap-2 mt-4 cursor-pointer group">
        <input
          type="checkbox"
          name="warranty"
          className="size-4 accent-green-600 cursor-pointer"
          checked={values.warranty}
          onChange={handleChange}
        />
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          אני רוצה אחריות לשלוש שנים עבור ₪4.00 ליחידה
        </div>
      </label>
    </div>
  );
};

export default StepOne;
