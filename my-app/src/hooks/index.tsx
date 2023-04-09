// folder hooks dùng để tạo các custom hooks - dùng để tái sử dụng logic và state logic giữa các component

import { useState, useEffect } from "react";
import axios from "axios";

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  return users;
};
