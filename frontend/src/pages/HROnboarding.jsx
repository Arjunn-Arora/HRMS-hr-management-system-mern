import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaCheckCircle, FaUserClock } from "react-icons/fa";

const HROnboarding = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get("/hr/onboarding-pending", { withCredentials: true });
      setPendingUsers(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleTriggerOnboarding = async (userId) => {
    try {
      await axios.put(`/hr/trigger-onboarding/${userId}`, {}, { withCredentials: true });
      toast.success("Onboarding triggered successfully for user.");
      setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
      // Dispatch an event to update the sidebar counter
      window.dispatchEvent(new Event("onboardingStatusChanged"));
    } catch (err) {
      toast.error("Failed to trigger onboarding.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading pending requests...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaUserClock className="text-3xl text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Pending Onboarding Actions</h1>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No users pending HR action.
                </td>
              </tr>
            ) : (
              pendingUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className="text-xs px-3 py-1 rounded-full capitalize font-medium bg-gray-200 text-gray-800">
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                      Pending HR
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleTriggerOnboarding(user._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm font-semibold flex items-center gap-2 ml-auto"
                    >
                      <FaCheckCircle /> Trigger Onboarding
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HROnboarding;
