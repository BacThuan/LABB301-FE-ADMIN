import "../../css/new.css";

import { useState, useEffect, useCallback } from "react";
import { productInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
const initData = {
  name: "",
  short_desc: "",
  long_desc: "",
  gender: "",
  brand: "",
  category: "",
};

const genders = ["Male", "Female"];
const NewProduct = () => {
  const [info, setInfo] = useState(initData);

  const search = useLocation().search;
  const params = new URLSearchParams(search).get("id");
  const token = Cookies.get("token");

  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);
  const navigate = useNavigate();

  // check valid data
  let valid = false;

  if (
    info.name === "" ||
    info.short_desc === "" ||
    info.long_desc === "" ||
    info.gender === "" ||
    info.brand === "" ||
    info.category === ""
  ) {
    valid = false;
  } else {
    valid = true;
  }

  const getBrands = useCallback(async () => {
    const brands = await axios.get(`${api}/read/brands/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setBrand(brands.data);
  });

  const getCategories = useCallback(async () => {
    const categories = await axios.get(`${api}/read/categories/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setCategory(categories.data);
  });
  useEffect(() => {
    document.title = params === null ? "New Product " : "Update Product";
    if (!token) navigate("/auth");
    getBrands();
    getCategories();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (params !== null) {
          const product = await axios.get(`${api}/read/product?id=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = product.data;
          setInfo(data);
        } else setInfo(initData);
      } catch (err) {
        if (window.confirm(err.response.data.message)) {
          navigate("/");
        }
      }
    };
    getProduct();
  }, [params]);

  // change info
  const handleChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  });

  // submit
  const handlesubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      // add new
      if (params === null) {
        if (window.confirm("Are you sure to add new product ?")) {
          await axios.post(`${api}/create/product`, info, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          navigate("/products");
        }
      }
      // update
      else {
        if (window.confirm("Are you sure to update this product ?")) {
          info.id = params;
          await axios.put(`${api}/update/product`, info, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          navigate("/products");
        }
      }
    } catch (err) {
      if (window.confirm(err.response.data.message)) {
        navigate("/");
      }
    }
  });

  // get option
  const getOption = useCallback((type, data, index) => {
    let variable;

    if (type === "brand") {
      variable = info.brand;
    } else if (type === "category") {
      variable = info.category;
    } else {
      variable = info.gender;
    }
    // if this selected
    if (params != null) {
      if (variable === data) {
        return (
          <option key={index} value={data} selected>
            {data}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={data}>
        {data}
      </option>
    );
  });

  const openAddShoe = useCallback(() => {
    navigate(`/items/new?idProduct=${params}`);
  });
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params === null ? "Add New Product " : "Update Product"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handlesubmit}>
            <div className="formBody">
              <div>
                {productInputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    {input.id !== "long_desc" && (
                      <input
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                        placeholder={input.placeholder}
                        required={true}
                        defaultValue={info ? info[`${input.id}`] : ""}
                      />
                    )}

                    {input.id === "long_desc" && (
                      <textarea
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                        placeholder={input.placeholder}
                        required={true}
                        defaultValue={info ? info[`${input.id}`] : ""}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="formInput">
                  <label>Gender</label>
                  <select name="status" id="gender" onChange={handleChange}>
                    <option value="">Choose gender</option>
                    {genders.map((gender, index) =>
                      getOption("gender", gender, index)
                    )}
                  </select>
                </div>
                <div className="formInput">
                  <label>Brand</label>
                  <select name="status" id="brand" onChange={handleChange}>
                    <option value="">Choose brand</option>
                    {brands.map((brand, index) =>
                      getOption("brand", brand, index)
                    )}
                  </select>
                </div>
                <div className="formInput">
                  <label>Category</label>
                  <select name="status" id="category" onChange={handleChange}>
                    <option value="">Choose category</option>
                    {categories.map((category, index) =>
                      getOption("category", category, index)
                    )}
                  </select>
                </div>
                {params != null && (
                  <button type="button" onClick={openAddShoe}>
                    Add new item
                  </button>
                )}
              </div>
            </div>

            <br></br>
            <button type="submit" disabled={!valid}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
