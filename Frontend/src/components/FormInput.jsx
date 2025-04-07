const FormInput = ({ label, ...props }) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
  
  export default FormInput;
  