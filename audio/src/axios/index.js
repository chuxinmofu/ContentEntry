import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:3100/",
  baseURL: "http://192.168.99.32:3100/",
});

export default instance;
