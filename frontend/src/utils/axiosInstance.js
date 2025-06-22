import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // your backend base
  withCredentials: true, // for cookie access
});

export default instance;
