import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AfterVerify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = params.get("email");
    const role = params.get("role");

    if (!email || !role) {
      alert("Link verifikasi tidak valid");
      return;
    }

    let endpoint = "";

    if (role === "bidan") {
      endpoint = `${BASE_URL}/api/bidan/verifikasi`;
    } else if (role === "ibu") {
      endpoint = `${BASE_URL}/api/ibu/verifikasi`;
    } else {
      alert("Role tidak dikenal.");
      return;
    }

    axios.post(endpoint, { email })
      .then(() => {
        alert("Email berhasil diverifikasi. Silakan login.");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Gagal verifikasi:", err);
        alert("Gagal melakukan verifikasi email.");
      });
  }, [params, navigate]);

  return (
    <div className="p-6 text-center">
      <p>Memverifikasi email...</p>
    </div>
  );
};

export default AfterVerify;
