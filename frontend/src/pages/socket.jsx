import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import { API_URL } from "../helpers/ApiUrl";
import axios from "axios";
const Socket = (props) => {
  const [totaluser, settotaluser] = useState(0);
  const [message, setmessage] = useState([]);

  const [addmessage, setaddmessage] = useState({
    username: "",
    message: "",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/socket`)
      .then((res) => {
        setmessage(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const io = socketIo(API_URL, { transports: ["websocket"] });
    io.on("user connected", (data) => {
      settotaluser(data);
    });

    io.on("chat message", (data) => {
      setmessage(data);
    });

    return () => io.disconnect(); // component willunmount
  }, []); // component didmount

  const oninputChange = (e) => {
    setaddmessage({ ...addmessage, [e.target.name]: e.target.value });
  };

  const onKirimClick = () => {
    console.log(addmessage);
    axios
      .post(`${API_URL}/socket`, addmessage)
      .then((res) => {
        console.log(res);
        setaddmessage({ ...addmessage, message: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <center>
      <div>jumlah user terkoneksi : {totaluser}</div>
      {message.map((val, index) => {
        return (
          <div key={index}>
            <div>name : {val.username}</div>
            <div>message : {val.message}</div>
          </div>
        );
      })}
      <br />
      <input
        type="text"
        name="username"
        placeholder="name"
        onChange={oninputChange}
        value={addmessage.username}
      />
      <br /> <br />
      <input
        type="text"
        name="message"
        placeholder="message"
        onChange={oninputChange}
        value={addmessage.message}
      />
      <button onClick={onKirimClick}>kirim</button>
    </center>
  );
};

export default Socket;
