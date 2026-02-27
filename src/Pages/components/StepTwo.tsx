import { FaUserLarge } from "react-icons/fa6";
import type { StepProps } from "../../types";
// import IntlTelInput from "intl-tel-input/reactWithUtils";
// import { useState } from "react";
// import "intl-tel-input/styles";
import { InputCountries } from "../../utils/constants";

const StepTwo: React.FC<StepProps> = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}) => {
  return (
    <div>
      <div className="flex items-center gap-0.5 mb-4">
        <FaUserLarge />
        <h2 className="font-bold text-base">שלב 2: פרטי לקוח</h2>
      </div>
      <div className="">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold" htmlFor="firstName">
              שם פרטי
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="border rounded-md py-2 pr-3 border-gray-300"
              placeholder="שם פרטי"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.firstName && errors.firstName && (
              <div className="text-red-500 text-xs">{errors.firstName}</div>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold" htmlFor="lastName">
              שם משפחה
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="border rounded-md py-2 pr-3 border-gray-300"
              placeholder="שם משפחה"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.lastName && errors.lastName && (
              <div className="text-red-500 text-xs">{errors.lastName}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
          <label className="font-semibold" htmlFor="email">
            כתובת דוא"ל
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="border rounded-md py-2 pr-3 border-gray-300"
            placeholder='כתובת דוא"ל'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <div className="text-red-500 text-xs">{errors.email}</div>
          )}
        </div>
        <div className="space-y-2 my-4">
          <label className="flex items-start gap-2 cursor-pointer font-semibold">
            <input
              type="checkbox"
              name="marketingEmails"
              className="mt-0.5 accent-green-600"
              checked={values.marketingEmails}
              onChange={handleChange}
            />
            <span className="text-xs text-gray-500 text-right">
              אני מעוניין לקבל מיילים עם הצעות מיוחדות, עדכונים ותוכן מותאם
              אישית מהחברה.
            </span>
          </label>
          <label className="flex font-semibold items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="marketingSMS"
              className="mt-0.5 accent-green-600"
              checked={values.marketingSMS}
              onChange={handleChange}
            />
            <span className="text-xs text-gray-500 text-right">
              אני מעוניין לקבל הודעות SMS ושיחות טלפון מהחברה על הצעות ועדכונים
              – כולל שיחות אוטומטיות או עם סיוע חכם.
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="phoneNumber">
            מספר טלפון
          </label>
          <div className="border rounded-md flex border-gray-300">
            <div className="border-l border-l-gray-300">
              <select
                name="phoneCountryCode"
                id="phoneCountryCode"
                className="w-20 outline-none h-full"
                value={values.phoneCountryCode}
                onChange={handleChange}
              >
                {/* {InputCountries.map((item) => {
                  return (
                    <option value={item.dialCode}>
                      {item.dialCode}+{item.name}
                    </option>
                  );
                })} */}
                {InputCountries.map((item) => (
                  <option key={item.code} value={item.dialCode}>
                    {values.phoneCountryCode === item.dialCode
                      ? `+${item.dialCode}`
                      : `${item.name} (+${item.dialCode})`}{" "}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="py-2 pr-3 flex-1"
              placeholder="מספר טלפון"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <div className="text-red-500 text-xs">{errors.phoneNumber}</div>
          )}
        </div>
        {/* <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="phoneNumber">מספר טלפון</label>

          <div className="border rounded-md border-gray-300 p-2 ">
            <IntlTelInput
              initOptions={{
                initialCountry: "us",
                separateDialCode: true,
                nationalMode: false,
              }}
              onChangeNumber={(num) => {
                setFieldValue("phoneNumber", num);
              }}
              onChangeValidity={(valid) => {
                setFieldValue("phoneValid", valid);
              }}
            />
          </div>

          {touched.phoneNumber && errors.phoneNumber && (
            <div className="text-red-500 text-xs">{errors.phoneNumber}</div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default StepTwo;
