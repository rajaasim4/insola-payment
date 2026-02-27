import { useField } from "formik";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
}

const FormInput = ({ label, ...props }: Props) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">{label}</label>

      <input
        {...field}
        {...props}
        className={`w-full border rounded-md px-3 py-2 outline-none
        ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"}`}
      />

      {meta.touched && meta.error && (
        <p className="text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default FormInput;
