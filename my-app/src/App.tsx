import React from "react";
import "./App.css";
import { useUsers } from "./hooks/index";
import Users from "./stores/users";

function App() {
  const users = useUsers();
  return (
    <div>
      <Users />
    </div>
  );
}

export default App;
