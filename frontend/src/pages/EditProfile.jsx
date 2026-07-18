import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    dob: "",
    presentAddress: "",
    permanentAddress: "",
    phone: "",
    maritalStatus: "",
    pan: "",
    aadhar: "",
  });
  const [showPan, setShowPan] = useState(false);
  const [showAadhar, setShowAadhar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        const userData = res.data.user;
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().split('T')[0];
        };

        setUser(userData);
        setForm({
          dob: formatDate(userData.dob),
          presentAddress: userData.presentAddress || userData.address || "",
          permanentAddress: userData.permanentAddress || "",
          phone: userData.phone || "",
          maritalStatus: userData.maritalStatus || "",
          pan: userData.pan || "",
          aadhar: userData.aadhar || ""
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
      if (user.onboardingStatus === 'Onboarding Triggered') {
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const calculateExperience = (doj) => {
    if (!doj) return "N/A";
    const joinDate = new Date(doj);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0 && months === 0) return "Less than a month";
    let exp = "";
    if (years > 0) exp += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) exp += `${months} month${months > 1 ? 's' : ''}`;
    return exp.trim();
  };

  const maskString = (str) => {
    if (!str) return "N/A";
    return "**********";
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        {user.onboardingStatus === 'Onboarding Triggered' ? 'Complete Your Onboarding' : 'Employee Information'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Read-only Professional Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Professional Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500">Name</label>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Email</label>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Department</label>
              <div className="font-medium">{user.department || "N/A"}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Designation</label>
              <div className="font-medium">{user.designation || "N/A"}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Employment Type</label>
              <div className="font-medium">{user.employmentType || "N/A"}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Employee Status</label>
              <div className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.employeeStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.employeeStatus || "N/A"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Date of Joining</label>
              <div className="font-medium">{user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : "N/A"}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Current Experience</label>
              <div className="font-medium text-indigo-600">{calculateExperience(user.dateOfJoining)}</div>
            </div>
            {user.dateOfExit && (
              <div>
                <label className="block text-sm text-gray-500">Date of Exit</label>
                <div className="font-medium text-red-600">{new Date(user.dateOfExit).toLocaleDateString()}</div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-500">Reporting Manager</label>
              <div className="font-medium">{user.teamLeadId ? "Assigned" : "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Personal Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full p-2 border rounded" />
              <div className="text-sm text-gray-500 mt-1">Age: <span className="font-medium text-gray-800">{calculateAge(form.dob)}</span></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Gender</label>
              <div className="w-full p-2 border rounded bg-gray-50 text-gray-600">{user.gender || "N/A"}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Marital Status</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">-- Select --</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone Number" />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">PAN</label>
              <input type="text" name="pan" value={form.pan} onChange={handleChange} className="w-full p-2 border rounded" placeholder="PAN Number" />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Aadhar</label>
              <input type="text" name="aadhar" value={form.aadhar} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Aadhar Number" />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Present Address</label>
              <textarea name="presentAddress" value={form.presentAddress} onChange={handleChange} className="w-full p-2 border rounded" rows="2" placeholder="Present Address" />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Permanent Address</label>
              <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} className="w-full p-2 border rounded" rows="2" placeholder="Permanent Address" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 font-semibold mt-4">
              {user.onboardingStatus === 'Onboarding Triggered' ? 'Save & Complete Onboarding' : 'Save Personal Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
