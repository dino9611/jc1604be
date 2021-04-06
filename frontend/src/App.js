import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const users = await axios.get("http://localhost:5001/users");
      console.log(users.data);
      setdata(users.data);
    };
    fetchdata();
  }, []);

  const renderData = () => {
    return data.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.password}</td>
          <td>{val.username}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <center>
        <table>
          <thead>
            <th>No.</th>
            <th>password</th>
            <th>Nama</th>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </center>
    </div>
  );
}

export default App;
