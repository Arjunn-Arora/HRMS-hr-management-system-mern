import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.password || !passwords.confirm)
      return toast.error("Please fill in both fields");
    if (passwords.password !== passwords.confirm)
      return toast.error("Passwords do not match");

    try {
      await axios.post(`/auth/verify/${token}`, { password: passwords.password });
      toast.success("Password set successfully. You can now login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Set Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="password"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
