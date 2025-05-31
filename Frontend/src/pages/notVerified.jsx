import React from "react";
import FormLayout from "../components/FormLayout";
import SubmitButton from "../components/SubmitButton";



const LoginNotVerified = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Pengguna";

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  

  return (


    <FormLayout
    className="mt-100"
    title="Terima Kasih sudah Registrasi 👋"
    description="Selamat bergabung dengan kami"
    
  >
  

      <div className="space-y-16 text-center mt-10 mb-8">
        <p className="text-sm text-gray-600">
          Silakan verifikasi akun Anda terlebih dahulu melalui email. <br />
          Admin akan mengkonfirmasi akun anda
        </p>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-medium"
            onClick={handleBackToLogin}
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </FormLayout>
  );
};

export default LoginNotVerified;
