import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../helpers/ApiUrl";

const SendEmailVerified = (props) => {
  const [Loading, setLoading] = useState(true);
  const [berhasil, setberhasil] = useState(true);

  return (
    <div>
      <center>
        <h1>SEND email </h1>
        <button>send email</button>
      </center>
    </div>
  );
};

export default SendEmailVerified;
