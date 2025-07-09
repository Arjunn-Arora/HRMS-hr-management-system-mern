import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TeamLeadAttendance from "./pages/TeamLeadAttendance";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import CreateEmployee from "./pages/CreateEmployee";
import SetPassword from "./pages/SetPassword";
import ViewAttendance from "./pages/ViewAttendance";
import EditProfile from "./pages/EditProfile";
import AssignProjects from "./pages/AssignProjects";
import AllocatedProjects from "./pages/AllocatedProjects";
import AssignEmployeesToProject from "./pages/AssignEmployeesToProjects";
import ApplyLeave from "./pages/ApplyLeave";
import LeavePolicies from "./pages/LeavePolicies";
import LeaveApproval from "./pages/LeaveApproval";
// import ShowTeamMembers from "./pages/ShowTeamMembers";
// import ShowAllocatedProjects from "./pages/ShowAllocatedProjects";

// Auth wrapper
import PrivateRoute from "./components/PrivateRoute";
import LeaveDashboard from "./pages/LeaveDashboard";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <PrivateRoute allowedRoles={["hr"]}>
              <HRDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={["employee", "team_lead"]}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
  path="/teamlead/attendance"
  element={
    <PrivateRoute allowedRoles={["team_lead"]}>
      <TeamLeadAttendance />
    </PrivateRoute>
  }
/>

<Route
  path="/attendance"
  element={
    <PrivateRoute allowedRoles={["employee", "team_lead"]}>
      <ViewAttendance />
    </PrivateRoute>
  }
/>

<Route
  path="/announcements"
  element={
    <PrivateRoute allowedRoles={["admin","employee", "team_lead"]}>
      <AnnouncementsPage />
    </PrivateRoute>
  }
/>

<Route
  path="/hr/add-employee"
  element={
    <PrivateRoute allowedRoles={["hr"]}>
      <CreateEmployee />
    </PrivateRoute>
  }
/>

<Route
  path="/edit-profile"
  element={
    <PrivateRoute allowedRoles={["employee", "team_lead"]}>
      <EditProfile />
    </PrivateRoute>
  }
/>

<Route
  path="/hr/assign-projects"
  element={
    <PrivateRoute allowedRoles={["hr", "admin"]}>
      <AssignProjects />
    </PrivateRoute>
  }
/>

<Route
  path="/hr/leaves"
  element={
    <PrivateRoute allowedRoles={["hr"]}>
      <LeaveDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/apply-leave"
  element={
    <PrivateRoute allowedRoles={["employee", "team_lead"]}>
      <ApplyLeave />
    </PrivateRoute>
  }
/>

<Route
  path="/hr/leave-policies"
  element={
    <PrivateRoute allowedRoles={["hr"]}>
      <LeavePolicies />
    </PrivateRoute>
  }
/>

<Route
  path="/teamlead/projects"
  element={
    <PrivateRoute allowedRoles={["team_lead"]}>
      <AllocatedProjects />
    </PrivateRoute>
  }
/>

<Route
  path="/teamlead/assign/:projectId"
  element={
    <PrivateRoute allowedRoles={["team_lead"]}>
      <AssignEmployeesToProject />
    </PrivateRoute>
  }
/>


<Route
  path="/hr/leave-approvals"
  element={
    <PrivateRoute allowedRoles={["hr"]}>
      <LeaveApproval />
    </PrivateRoute>
  }
/>


<Route path="/verify/:token" element={<SetPassword />} />
{/* <Route
  path="/teamlead/team-members"
  element={
    <PrivateRoute allowedRoles={["team_lead"]}>
      <ShowTeamMembers />
    </PrivateRoute>
  }
/>
<Route
  path="/teamlead/projects"
  element={
    <PrivateRoute allowedRoles={["team_lead"]}>
      <ShowAllocatedProjects />
    </PrivateRoute>
  }
/> */}

        {/* Redirect unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
