import React, { useState } from "react";
import axios from "axios";
import FormLayout from "../components/FormLayout";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

const Login = () => {
  const [form, setForm] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let response;

      if (form.role === "bidan") {
        response = await axios.post("http://localhost:8000/api/bidan/login", {
          email_bidan: form.email,
          sandi_bidan: form.password,
        });
      } else if (form.role === "ibu") {
        response = await axios.post("http://localhost:8000/api/ibu/login", {
          email_ibu: form.email,
          sandi_ibu: form.password,
        });
      } else {
        setError("Silakan pilih role login terlebih dahulu.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ name: response.data.name || form.email })
      );

      setSuccess("Login berhasil!");

      if (form.role === "bidan") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal. Coba lagi.";
      setError(msg);
    }
  };

  return (
    <FormLayout
      title="Masuk"
      description="Masukkan email dan password Anda"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Masuk sebagai*
          </label>
          <select id="role" name="role" value={form.role} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled className="text-gray-400">Pilih Role</option>
            <option value="bidan">Bidan</option>
            <option value="ibu">Ibu</option>
          </select>
        </div>
        <FormInput
          label="Email*"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Masukkan Email"
        />
        <PasswordInput
          label="Password*"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Masukkan kata sandi"
        />
        <SubmitButton>Masuk</SubmitButton>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-3">{success}</p>}

      <p className="text-sm text-center mt-6">
        Belum memiliki akun?{" "}
        <a href="/register/bidan" className="text-blue-800 font-medium">Daftar sebagai Bidan</a> atau{" "}
        <a href="/register/ibu" className="text-blue-800 font-medium">Daftar sebagai Ibu</a>
      </p>
    </FormLayout>
  );
};

export default Login;