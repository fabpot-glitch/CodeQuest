import { useParams } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: password })
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="border w-full p-2 mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          onClick={handleReset}
          className="bg-purple-600 text-white w-full py-2 rounded"
        >
          Reset
        </button>

        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
