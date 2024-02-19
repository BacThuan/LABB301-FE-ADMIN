import "../../css/new.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useState, useEffect, useCallback } from "react";
import { productItemInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import { formatState } from "../../store/convert";
const initData = {
  price: "",
  quantity: "",
  size: "",
  color: "",
  state: "",
  product: "",
};

const NewProductItem = () => {
  const [files, setFiles] = useState([]);

  const [info, setInfo] = useState(initData);
  const [listImage, setListImage] = useState([]);

  const [reusedImage, setReusedImage] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const [primary, setPrimary] = useState(-1);

  const search = useLocation().search;
  let idProduct = new URLSearchParams(search).get("idProduct");
  const params = new URLSearchParams(search).get("id");
  const token = Cookies.get("token");

  const [states, setState] = useState([]);
  const [colors, setColor] = useState([]);
  const navigate = useNavigate();

  const getStates = useCallback(async () => {
    const states = await axios.get(`${api}/read/states-product/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setState(states.data);
  });

  const getColors = useCallback(async () => {
    const colors = await axios.get(`${api}/read/colors/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setColor(colors.data);
  });

  useEffect(() => {
    document.title = params === null ? "Add shoe item" : "Update shoe item";
    if (!token) navigate("/auth");
    setInfo((prev) => ({ ...prev, product: idProduct }));
    getStates();
    getColors();

    const getProductItem = async () => {
      try {
        if (params !== null) {
          const items = await axios.get(`${api}/read/item?id=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = items.data;
          setInfo(data);
          setListImage(data.images);
        }
      } catch (err) {
        if (window.confirm(err.response.data.message)) {
          navigate("/items");
        } else if (window.confirm(err.response.data)) {
          navigate("/items");
        }
      }
    };
    getProductItem();
  }, [params]);

  useEffect(() => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    newImages.push(...reusedImage);

    setNewImage(newImages);
  }, [files, reusedImage]);

  // change info
  const handleChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  });

  const handleChoosePrevious = (e, img) => {
    if (e.currentTarget.className === "reused-image") {
      e.currentTarget.className = "check";
      setReusedImage((prev) => [...prev, img]);
    }
    //
    else {
      e.currentTarget.className = "reused-image";
      const newList = reusedImage.filter((url) => url !== img);
      setReusedImage(newList);
    }

    if (reusedImage.length === 0) setPrimary(-1);
    else setPrimary(0);
  };

  const handleSelectImage = (e) => {
    setFiles(e.target.files);
    setPrimary(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (params === null && files.length === 0)
      alert("Choose aleast one image!");
    //
    else {
      try {
        const formData = new FormData();

        formData.append("price", info.price);
        formData.append("quantity", info.quantity);
        formData.append("size", info.size);
        formData.append("color", info.color);
        formData.append("state", info.state);
        formData.append("product", info.product);
        formData.append("primaryImage", primary);
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
          }
        }

        // add new
        if (params === null) {
          await axios.post(`${api}/create/product-item`, formData, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data",
            },
          });
        }

        // update
        else {
          let deletePreImg = false;
          if (reusedImage.length < files.length && reusedImage.length !== 0) {
            deletePreImg = window.confirm(
              "Do you want to delete unseleted previous images? "
            );
          }

          formData.append("id", params);
          formData.append("deletePreImg", deletePreImg);

          if (reusedImage.length === 0) {
            formData.append("reusedImage", listImage);
          } else formData.append("reusedImage", reusedImage);

          await axios.put(`${api}/update/product-item`, formData, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data",
            },
          });
        }

        navigate("/items");
      } catch (err) {
        console.log(err);
      }
    }
  };

  // get option
  const getState = (data, index) => {
    let variable = info.state;

    // if this selected
    if (params != null) {
      if (variable === data) {
        return (
          <option key={index} value={data} selected>
            {formatState(data)}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={data}>
        {formatState(data)}
      </option>
    );
  };

  // get option
  const getColor = (data, index) => {
    let variable = info.color;

    // if this selected
    if (params != null) {
      if (variable === data.name) {
        return (
          <option key={index} value={data.name} selected>
            {data.name}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={data.name} className="colorContent">
        {data.name}
      </option>
    );
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>
            {params === null ? "Add New Item " : "Update Item"} For Product{" "}
            {idProduct}
          </h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              <div>
                {productItemInputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      onChange={handleChange}
                      type={input.type}
                      placeholder={input.placeholder}
                      required={true}
                      defaultValue={info ? info[`${input.id}`] : ""}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="formInput">
                  <label>Color</label>
                  <select
                    name="status"
                    id="color"
                    onChange={handleChange}
                    required={true}
                  >
                    <option value="">Choose color</option>
                    {colors.map((color, index) => getColor(color, index))}
                  </select>
                </div>
                <div className="formInput">
                  <label>State</label>
                  <select
                    name="status"
                    id="state"
                    onChange={handleChange}
                    required={true}
                  >
                    <option value="">Choose state</option>
                    {states.map((state, index) => getState(state, index))}
                  </select>
                </div>
              </div>
            </div>

            <div className="formInput">
              <label htmlFor="file">
                Chọn ảnh: <DriveFolderUploadOutlinedIcon className="icon" />
              </label>
              <input
                type="file"
                id="file"
                multiple
                onChange={(e) => handleSelectImage(e)}
                style={{ display: "none" }}
              />
            </div>

            <br></br>
            {listImage?.length > 0 && (
              <div className="showPreviousImage">
                Click to choose previous images. If you don't select and don't
                add new image, all previous image will be reused.
                <div className="listReused">
                  {listImage.map((img, index) => {
                    return (
                      <div
                        className="reused-image"
                        onClick={(e) => handleChoosePrevious(e, img)}
                      >
                        <img key={index} src={img} className="reused" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <br></br>
            {newImage?.length > 0 && (
              <div className="showPreviousImage">
                New images. Click to choose a primary image!
                <div className="listReused">
                  {newImage.map((img, index) => {
                    return (
                      <div
                        className={primary !== index ? "reused-image" : "check"}
                        onClick={() => setPrimary(index)}
                      >
                        <img key={index} src={img} className="reused" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default NewProductItem;
