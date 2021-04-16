import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../helpers/ApiUrl";

const Verified = (props) => {
  console.log(props.match.params.token);
  const [Loading, setLoading] = useState(true);
  const [berhasil, setberhasil] = useState(true);

  useEffect(() => {
    // ? with token
    let token = props.match.params.token;
    axios
      .get(`${API_URL}/auth/verifiedemail`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setberhasil(false);
      })
      .finally(() => {
        setLoading(false);
      });
    //? without token
    // let id = props.match.params.token;
    // axios
    //   .get(`${API_URL}/auth/verified/${id}`)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setberhasil(false);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  const sendmail = () => {
    let data = localStorage.getItem("data"); // harusnya dari redux
    data = JSON.parse(data);
    console.log(data);
    let datapost = {
      id: data.id,
      email: data.email,
      username: data.username,
    };
    axios
      .post(`${API_URL}/auth/sendverified`, datapost)
      .then((res) => {
        alert("berhasil");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (Loading) {
    return (
      <div>
        <h1>loading verified</h1>
      </div>
    );
  } else {
    if (berhasil) {
      return (
        <div>
          <h1>berhasil verified</h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1>gagal verified</h1>
          <button onClick={sendmail}>send verified again</button>
        </div>
      );
    }
  }
};

export default Verified;
