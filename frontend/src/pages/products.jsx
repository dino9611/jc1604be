import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { API_URL } from "./../helpers/ApiUrl";
const Products = (props) => {
  const [data, setdata] = useState([]);
  const [addData, setAddData] = useState({
    name: "",
    description: "",
  });
  const [addFile, setAddFile] = useState(null);
  const [editfile, seteditFile] = useState(null);
  const [Editdata, setEditData] = useState({
    name: "",
    description: "",
  });
  const [isOpen, setisOpen] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fileChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      setAddFile(e.target.files[0]);
    } else {
      setAddFile(null);
    }
  };
  const EditfileChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      seteditFile(e.target.files[0]);
    } else {
      seteditFile(null);
    }
  };

  const OnAddDataUploadClick = () => {
    console.log(addFile);
    const formdata = new FormData();
    formdata.append("image", addFile);
    formdata.append("data", JSON.stringify(addData)); // data bersama foto harus diubah ke json
    axios
      .post(`${API_URL}/products`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setdata(res.data);
        setAddFile(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDeleteClick = (id) => {
    var tanya = window.confirm("delete nggak data dengan id " + id + " ?");
    if (tanya) {
      axios
        .delete(`http://localhost:5000/products/${id}`)
        .then((res) => {
          setdata(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onEditClick = (index) => {
    setEditData({ ...Editdata, ...data[index] });
    setisOpen(true);
  };

  const renderData = () => {
    return data.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {val.image ? (
              <img src={API_URL + val.image} height="200px" />
            ) : (
              "foto tidak ada"
            )}
          </td>
          <td>{val.name}</td>
          <td>{val.description}</td>
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

  const Savedata = () => {
    console.log(Editdata);
    const { id, name, description } = Editdata;
    console.log(editfile);
    const data = {
      name,
      description,
    };
    const formdata = new FormData();
    formdata.append("image", editfile);
    formdata.append("data", JSON.stringify(data)); // data bersama foto harus diubah ke json
    axios
      .put(`${API_URL}/products/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setdata(res.data);
        seteditFile(null);
        setisOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const OnInputChange = (e) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };
  const onEditinputChange = (e) => {
    setEditData({ ...Editdata, [e.target.name]: e.target.value });
  };

  const toggle = () => {
    setisOpen(false);
    seteditFile(null);
  };
  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit data</ModalHeader>
        <ModalBody>
          <input
            className="form-control my-2"
            placeholder="username"
            name="name"
            value={Editdata.name}
            type="text"
            onChange={onEditinputChange}
          />
          <input
            className="form-control my-2"
            placeholder="desctiption"
            type="text"
            name="description"
            value={Editdata.description}
            onChange={onEditinputChange}
          />
          <input
            className="form-control my-2"
            placeholder="file"
            name="file"
            type="file"
            onChange={EditfileChange}
          />
          {editfile ? (
            <img
              src={URL.createObjectURL(editfile)}
              height="100px"
              width="400px"
            />
          ) : (
            <div>foto belum masuk</div>
          )}
        </ModalBody>
        <ModalFooter>
          <button onClick={Savedata}>Save data</button>
          <button>Cancel</button>
        </ModalFooter>
      </Modal>
      <div>
        <table>
          <thead>
            <th>No.</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
        <input
          className="form-control my-2"
          placeholder="username"
          name="name"
          value={addData.name}
          type="text"
          onChange={OnInputChange}
        />
        <input
          className="form-control my-2"
          placeholder="desctiption"
          type="text"
          name="description"
          value={addData.description}
          onChange={OnInputChange}
        />
        <input
          className="form-control my-2"
          placeholder="file"
          type="file"
          onChange={fileChange}
        />
        {addFile ? (
          <img src={URL.createObjectURL(addFile)} />
        ) : (
          <div>foto belum masuk</div>
        )}
        <button onClick={OnAddDataUploadClick} className="btn btn-primary">
          add
        </button>
      </div>
    </div>
  );
};

export default Products;
