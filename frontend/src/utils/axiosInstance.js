import axios from "axios";

const instance = axios.create({
  baseURL: "https://hrms-hr-management-system-mern.onrender.com/api", // your backend base
  withCredentials: true, // for cookie access
});

// instance.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response) {
//       const status = error.response.status;
//       if (status === 400) {
//         window.location.href = "/400";
//       } else if (status === 500) {
//         window.location.href = "/500";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
