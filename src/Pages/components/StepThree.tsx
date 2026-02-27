import React from "react";
import { FaCheck, FaGlobeAmericas } from "react-icons/fa";
import type { StepProps } from "../../types";
import { COUNTRIES } from "../../utils/constants";

const StepThree: React.FC<StepProps> = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}) => {
  const leftFeatures = [
    "בלימת זעזועים ותמיכה מקיפה בכל תנועה",
    "נוחות שלא הכרתם קודם, בכל נעל",
    "מגנטים משולבים לעיסוי רפלקסולוגי ללא מאמץ",
  ];
  return (
    <div>
      <div className="space-y-3 mb-6">
        {leftFeatures.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <FaCheck />
            <span className="text-sm font-bold text-gray-900 text-right leading-snug">
              {feature}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-0.5 mb-4">
        <FaGlobeAmericas />
        <h2 className="font-bold text-base">שלב 3: כתובת למשלוח</h2>
      </div>

      <div className="">
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="country">
            מדינה
          </label>
          <select
            name="country"
            id="country"
            className="border rounded-md py-2 pr-3 border-gray-300 bg-white"
            value={values.country}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">בחר מדינה</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {touched.country && errors.country && (
            <div className="text-red-500 text-xs">{errors.country}</div>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="city">
            עיר
          </label>
          <input
            type="text"
            name="city"
            id="city"
            className="border rounded-md py-2 pr-3 border-gray-300"
            placeholder="עיר"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.city && errors.city && (
            <div className="text-red-500 text-xs">{errors.city}</div>
          )}
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
          <label className="font-semibold" htmlFor="streetAddress">
            רחוב, מספר בית ודירה
          </label>
          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            className="border rounded-md py-2 pr-3 border-gray-300"
            placeholder="רחוב, מספר בית ודירה"
            value={values.streetAddress}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.streetAddress && errors.streetAddress && (
            <div className="text-red-500 text-xs">{errors.streetAddress}</div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-5 mt-4">
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold" htmlFor="region">
              מחוז/אזור
            </label>
            <input
              type="text"
              name="region"
              id="region"
              className="border rounded-md py-2 pr-3 border-gray-300"
              placeholder="מחוז/אזור"
              value={values.region}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.region && errors.region && (
              <div className="text-red-500 text-xs">{errors.region}</div>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold" htmlFor="postalCode">
              מיקוד
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              className="border rounded-md py-2 pr-3 border-gray-300"
              placeholder="מיקוד"
              value={values.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.postalCode && errors.postalCode && (
              <div className="text-red-500 text-xs">{errors.postalCode}</div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <label className="font-semibold" htmlFor="shippingMethod">
              משלוח
            </label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={values.shippingMethod === "standard"}
                onChange={handleChange}
                className="size-5"
              />
              <label
                className="font-semibold"
                htmlFor="
              "
              >
                רגיל ₪15.00
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
