const PasswordInput = ({ label, ...props }) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="password"
        {...props}
        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-xs text-gray-500">Harus minimal 8 karakter</span>
    </div>
  );
  
  export default PasswordInput;
  