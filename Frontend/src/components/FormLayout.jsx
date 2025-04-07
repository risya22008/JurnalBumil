import FormQuote from "./FormQuote";

const FormLayout = ({ title, description, children }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl flex overflow-hidden">
        <div className="w-full md:w-1/2 p-10">
          <img src="/logo.jpg" alt="Logo" className="h-8 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{description}</p>
          {children}
          <footer className="mt-10 text-xs text-gray-400 flex justify-between">
            <span>© Jurnal Bumil 2025</span>
            <span>help@jurnalbumil.com</span>
          </footer>
        </div>
        <FormQuote />
      </div>
    </div>
  );
  
  export default FormLayout;
  