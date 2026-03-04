import { FaUserLarge } from "react-icons/fa6";
import type { StepProps } from "../../../types";

// function formatPhoneNumber(input: string): string {
//   // Remove all non-digit characters
//   const digits = input.replace(/\D/g, "");
//   // Limit to 15 digits (Tranzila max)
//   return digits.slice(0, 15);
// }

const StepTwo: React.FC<StepProps> = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  // setFieldValue,
}) => {
  return (
    <div>
      <div className="flex items-center gap-0.5 mb-4">
        <FaUserLarge />
        <h2 className="font-bold text-base">שלב 2: פרטי לקוח</h2>
      </div>
      <div className="">
        <div className="grid md:grid-cols-2 gap-5">
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
              onChange={handleChange}
              checked
            />
            <span className="text-xs text-gray-500 text-right">
              אני מאשר/ת את{" "}
              <a
                href="https://ba-media.co.il/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                מדיניות הפרטיות
              </a>{" "}
              ומעוניין לקבל הודעות SMS ושיחות טלפון מהחברה על הצעות ועדכונים –
              כולל שיחות אוטומטיות או עם סיוע חכם.
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="phoneNumber">
            מספר טלפון
          </label>
          <div className="border rounded-md flex border-gray-300">
            <div className="border-l border-l-gray-300"></div>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              className="py-2 pr-3 text-right outline-none w-full"
              placeholder="0501234567"
              value={values.phoneNumber}
              // onChange={(e) => {
              //   const formatted = formatPhoneNumber(e.target.value);
              //   setFieldValue("phoneNumber", formatted);
              // }}
              onChange={handleChange}
              onBlur={handleBlur}
              inputMode="numeric"
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <div className="text-red-500 text-xs">{errors.phoneNumber}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
