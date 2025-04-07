const SubmitButton = ({ children }) => (
    <button
      type="submit"
      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-medium"
    >
      {children}
    </button>
  );
  
  export default SubmitButton;
  