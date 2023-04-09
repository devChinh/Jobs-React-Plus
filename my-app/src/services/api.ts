/**
 Thư mục services trong ReactJS thường được sử dụng để chứa các service (dịch vụ) 
 liên quan đến giao tiếp với API hoặc các hoạt động liên quan đến server trong ứng dụng
 */

import axios from "axios";
import { API_BASE_URL } from "../constants/api";

const ApiService = {
  getUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },
};

export default ApiService;
