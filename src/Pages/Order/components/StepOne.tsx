import { FaCalendarCheck } from "react-icons/fa";
import type { StepProps } from "../../../types";

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
      discount: "72% הנחה",
      originalPrice: "₪876.00",
      discountedPrice: "248.00",
      toplabel: "הכי פופולארי",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/4.png",
    },
    {
      id: 3,
      quantity: "3",
      description: "זוגות",
      discount: "66% הנחה",
      originalPrice: "₪657.00",
      discountedPrice: "225.00",
      toplabel: "",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/3.png",
    },
    {
      id: 2,
      quantity: "2",
      description: "זוגות",
      discount: "49% הנחה",
      originalPrice: "₪438.00",
      discountedPrice: "222.00",
      toplabel: "",
      bottomLable: "מבצע עבור מספר פריטים",
      img: "/images/2.png",
    },
    {
      id: 1,
      quantity: "1",
      description: "זוג",
      discount: "",
      originalPrice: "",
      discountedPrice: "219.00",
      toplabel: "",
      bottomLable: "",
      img: "/images/1.png",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-0.5 mb-4">
        <FaCalendarCheck />
        <h2 className="font-bold text-base">שלב 1: בחרו מידה וכמות</h2>
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
            <strong>S-M: EU 36-42</strong>
            <span className={values.size === "S-M" ? "font-bold" : ""}>
              (USA 5-10 , UK 3-8 , AU 3-8 )
            </span>
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
            <strong>L-XL: EU 42-47</strong>
            <span className={values.size === "L-XL" ? "font-bold" : ""}>
              (USA 10-14 , UK 8-12 , AU 8-12 )
            </span>{" "}
          </label>
        </div>
        {touched.size && errors.size && (
          <div className="text-red-500 text-sm">{errors.size}</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5 my-10">
        {products.map((item) => {
          return (
            <div
              key={item.id}
              className="rounded-sm cursor-pointer overflow-hidden relative pb-6"
              onClick={() => {
                setFieldValue("selectedProductId", item.id);
                setFieldValue("price", item.discountedPrice);
                setFieldValue("quantity", item.quantity);
              }}
            >
              <div
                className={`text-white h-7  font-bold py-1 w-full  text-center text-sm ${item.toplabel !== "" ? "bg-blue-400" : "bg-transparent"}`}
              >
                {item.toplabel}
              </div>
              <div
                className={`bg-gray-100  py-6 h-40 grid grid-cols-2 gap-3 border-2  ${values.selectedProductId === item.id ? "border-blue-400" : "border-transparent"}`}
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
              <div
                className={`text-white h-7 absolute bottom-0 left-0  font-bold  py-1 w-full  text-center text-sm ${item.bottomLable !== "" ? "bg-blue-400" : "bg-transparent"}`}
              >
                {item.bottomLable}
              </div>
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
