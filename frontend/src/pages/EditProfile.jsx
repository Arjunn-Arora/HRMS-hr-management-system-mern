import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    dob: "",
    address: "",
    phone: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        setUser(res.data.user);
        setForm({
          dob: res.data.user.dob || "",
          address: res.data.user.address || "",
          phone: res.data.user.phone || ""
        });
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/auth/update-profile", form, { withCredentials: true });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-Only Fields */}
        <input
          type="text"
          value={user.name}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          value={user.department || "N/A"}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />

        {/* Editable Fields */}
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Date of Birth"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Address"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
