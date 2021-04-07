import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setdata] = useState([]);
  const [addData, setaddData] = useState({
    username: "",
    password: "",
  });
  const [editData, seteditData] = useState({
    username: "",
    password: "",
    id: -1,
  });

  useEffect(() => {
    const fetchdata = async () => {
      const users = await axios.get("http://localhost:5000/users");
      console.log(users.data);
      setdata(users.data);
    };
    fetchdata();
  }, []);

  const renderData = () => {
    return data.map((val, index) => {
      if (val.id === editData.id) {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <input
                type="password"
                name="password"
                value={editData.password}
                className="form-control"
                onChange={OnEditInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="username"
                value={editData.username}
                className="form-control"
                onChange={OnEditInputChange}
              />
            </td>

            <td>
              <button className="btn btn-danger mr-2" onClick={onEditYesClick}>
                Yes
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={() => {
                  seteditData({
                    username: "",
                    password: "",
                    id: -1,
                  });
                }}
              >
                No
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.password}</td>
          <td>{val.username}</td>
          <td>
            <button
              onClick={() => onDeleteClick(val.id)}
              className="btn btn-danger mr-2"
            >
              Delete
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => onEditClick(index)}
            >
              Edit
            </button>
          </td>
        </tr>
      );
    });
  };
  const onEditClick = (index) => {
    seteditData(data[index]);
  };
  const onEditYesClick = () => {
    let id = editData.id;
    let data = {
      username: editData.username,
      password: editData.password,
    };
    axios
      .put(`http://localhost:5000/users/${id}`, data)
      .then((res) => {
        seteditData({
          username: "",
          password: "",
          id: -1,
        });
        setdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDeleteClick = (id) => {
    var tanya = window.confirm("delete nggak data dengan id " + id + " ?");
    if (tanya) {
      axios
        .delete(`http://localhost:5000/users/${id}`)
        .then((res) => {
          setdata(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const OnInputChange = (e) => {
    setaddData({ ...addData, [e.target.name]: e.target.value });
  };
  const OnEditInputChange = (e) => {
    console.log("coba");
    seteditData({ ...editData, [e.target.name]: e.target.value });
  };

  const onAddClick = () => {
    console.log(addData);
    // karena strukturenya sudah sama maka nggka perlu buat object baru lagi
    axios
      .post("http://localhost:5000/users", addData)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
        setaddData({
          username: "",
          password: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
      <div>
        <table>
          <thead>
            <th>No.</th>
            <th>password</th>
            <th>Nama</th>
            <th>Action</th>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
        <input
          className="form-control my-2"
          placeholder="username"
          name="username"
          value={addData.username}
          type="text"
          onChange={OnInputChange}
        />
        <input
          className="form-control my-2"
          placeholder="password"
          type="password"
          name="password"
          value={addData.password}
          onChange={OnInputChange}
        />
        <button onClick={onAddClick} className="btn btn-primary">
          add
        </button>
      </div>
    </div>
  );
}

export default App;
