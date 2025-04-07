import React, { useState } from "react";
import axios from "axios";
import FormLayout from "../components/FormLayout";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

const RegisterBidan = () => {
  const [form, setForm] = useState({
    nama_bidan: "",
    email_bidan: "",
    sandi_bidan: "",
    confirmPassword: "",
    kode_lembaga: "",
    kode_bidan: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.sandi_bidan.length < 8) {
      return setError("Password harus minimal 8 karakter.");
    }

    if (form.sandi_bidan !== form.confirmPassword) {
      return setError("Konfirmasi password tidak cocok.");
    }

    try {
      const { confirmPassword, ...postData } = form;
      await axios.post("http://localhost:8000/api/bidan", postData);
      setSuccess("Registrasi bidan berhasil!");
      setForm({
        nama_bidan: "",
        email_bidan: "",
        sandi_bidan: "",
        confirmPassword: "",
        kode_lembaga: "",
        kode_bidan: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan saat registrasi.";
      setError(msg);
    }
  };

  return (
    <FormLayout
      title="Daftar Sebagai Bidan"
      description="Buat akun untuk mengakses layanan bidan"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Nama Bidan*"
          name="nama_bidan"
          value={form.nama_bidan}
          onChange={handleChange}
          required
          placeholder="Masukkan Nama"
        />
        <FormInput
          label="Email*"
          name="email_bidan"
          type="email"
          value={form.email_bidan}
          onChange={handleChange}
          required
          placeholder="Masukkan Email"
        />
        <PasswordInput
          label="Password*"
          name="sandi_bidan"
          value={form.sandi_bidan}
          onChange={handleChange}
          required
          placeholder="Buat kata sandi"
        />
        <PasswordInput
          label="Ulangi Password*"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Ulangi kata sandi"
        />
        <FormInput
          label="Kode Lembaga*"
          name="kode_lembaga"
          value={form.kode_lembaga}
          onChange={handleChange}
          required
          placeholder="Contoh: L123"
        />
        <FormInput
          label="Kode Bidan*"
          name="kode_bidan"
          value={form.kode_bidan}
          onChange={handleChange}
          required
          placeholder="Contoh: B456"
        />
        <SubmitButton>Buat akun</SubmitButton>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-3">{success}</p>}

      <p className="text-sm text-center mt-6">
        Kembali ke{" "}
        <a href="/register/ibu" className="text-blue-800 font-medium">Halaman Ibu</a>
      </p>
    </FormLayout>
  );
};

export default RegisterBidan;
