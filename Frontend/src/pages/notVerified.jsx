import React from "react";
import FormLayout from "../components/FormLayout";
import SubmitButton from "../components/SubmitButton";

const LoginNotVerified = () => {
  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Pengguna";

  const handleBackToLogin = () => {
    console.log("Tombol diklik");
    window.location.href = "/login";
  };

  return (
    <FormLayout
      title="Akun Belum Terverifikasi"
      description="Verifikasi dibutuhkan"
    >
      <div className="space-y-6 text-center">
        <p className="text-lg font-medium text-gray-700">
          Halo, {userName}! 👋
        </p>
        <p className="text-sm text-gray-600">
          Silakan verifikasi akun Anda terlebih dahulu melalui email. <br />
          Atau kembali login menggunakan akun lain.
        </p>
        <div className="pt-4">
          <button 
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-medium"
          onClick={handleBackToLogin}>
            Kembali ke Login
          </button>
        </div>
      </div>
    </FormLayout>
  );
};

export default LoginNotVerified;
