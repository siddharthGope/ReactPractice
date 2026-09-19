import React, { useState, useEffect } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, users]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const deleteUser = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      const newList = users.filter(u => u.id !== id);
      setUsers(newList);
    }
  };

  console.log("Rendered:", Math.random());

  return (
    <div>
      <h2>Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        onChange={handleSearch}
        value={search}
      />
      {filtered.map((user, i) => (
        <div key={i} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default UsersList;
