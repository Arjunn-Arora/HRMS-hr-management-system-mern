import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const TeamLeadAttendance = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [presentIds, setPresentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("/teamlead/members", {
          withCredentials: true,
        });
        console.log("Team Members API response:", res.data);
        setTeamMembers(res.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const toggleAttendance = (id) => {
    setPresentIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const confirmSubmitAttendance = async () => {
  setModalOpen(false);
  try {
    const attendanceData = teamMembers
  .filter((member) => presentIds.includes(member._id))
  .map((member) => ({
  employeeId: member._id,
  projectName: member.projectName || "Not Assigned",
  projectId: member.projectId,
  isPresent: true
}));
    console.log("Submitting Attendance Data:", attendanceData);
    await axios.post("/attendance/mark", { attendanceData }, { withCredentials: true });

    toast.success("Attendance submitted successfully!");
    setPresentIds([]);
  } catch (error) {
    toast.error("Failed to submit attendance");
    console.error(error);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={40} color="#3B82F6" />
        </div>
      ) : (
        <>
          <table className="w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Project</th>
                <th className="border px-4 py-2 text-center">Present</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2">{member.projectName || "Not Assigned"}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={presentIds.includes(member._id)}
                      onChange={() => toggleAttendance(member._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
            disabled={presentIds.length === 0}
          >
            Submit Attendance
          </button>
        </>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Confirm Attendance Submission"
        className="max-w-md mx-auto mt-32 bg-white p-6 rounded shadow-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-3">Confirm Submission</h3>
        <p className="mb-4">Are you sure you want to submit the attendance?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmSubmitAttendance}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamLeadAttendance;
