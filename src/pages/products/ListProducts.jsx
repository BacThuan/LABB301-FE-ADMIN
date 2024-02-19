import "../../css/list.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
const initFilter = {
  brand: null,
  category: null,
  gender: null,
};

const ListProducts = ({ columns }) => {
  const navigate = useNavigate();

  const search = useLocation().search;
  const getId = new URLSearchParams(search).get("getId");
  const [addNewItem, setAddNewItem] = useState(false);

  const path = "products";
  const token = Cookies.get("token");

  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);

  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState();

  const [option, setOption] = useState("");

  const [productApi, setProductApi] = useState(
    `${api}/read/${path}?admin=true`
  );

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  const [filterData, setFilterData] = useState(initFilter);

  // find by id
  const [id, setId] = useState(null);

  const onClose = () => {
    setOption("");
  };

  const getBrands = async () => {
    const brands = await axios.get(`${api}/read/brands/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setBrand(brands.data);
  };

  const getCategories = async () => {
    const categories = await axios.get(`${api}/read/categories/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setCategory(categories.data);
  };

  useEffect(() => {
    document.title = "List " + path;
    if (!token) navigate("/auth");
    getBrands();
    getCategories();

    if (getId !== null) {
      setAddNewItem(true);
      alert("Choose 1 kind of product!");
    }
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure want to delete this product?`)) {
      try {
        await axios.delete(`${api}/delete/${path}?id=${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setRefetch(!refetch);
      } catch (err) {
        alert(err.response.data);
      }
    }
  };
  const action = (action) => {
    if (action === "filter") {
      setOption("filter");
    }
    //
    else if (action === "add") {
      if (!addNewItem) {
        navigate(`/${path}/new`);
      }
      //
      else {
        if (selected.length > 1)
          alert("Choose only 1 item to get type of product!");
        //
        else if (selected.length === 0)
          alert("Choose at least 1 item to get type of product!");
        //
        else navigate(`/items/new?idProduct=${selected[0]}`);
      }
    }
    //
    else if (action === "refetch") {
      setProductApi(`${api}/read/${path}?admin=true`);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    let brand = filterData.brand ? filterData.brand : "";
    let category = filterData.category ? filterData.category : "";
    let gender = filterData.gender ? filterData.gender : "";
    setProductApi(
      `${api}/read/${path}?admin=true&brand=${brand}&category=${category}&gender=${gender}`
    );

    setFilterData(initFilter);
    onClose();
  };

  const findProduct = () => {
    setProductApi(`${api}/read/${path}?admin=true&searching=${searching}`);
  };

  const findById = () => {
    setProductApi(`${api}/read/${path}?admin=true&productId=${id}`);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="blueButton"
              to={`/${path}/new?id=${params.row._id}`}
            >
              Edit
            </Link>

            <Link
              className="greenButton"
              to={`/items?idProduct=${params.row._id}`}
            >
              Items
            </Link>

            <Link
              className="purpleButton"
              to={`/items/new?idProduct=${params.row._id}`}
            >
              Add new item
            </Link>

            <div
              className="redButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="listData">
      {option === "filter" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">Product Filter</div>

            <form className="update-status" onSubmit={handleFilter}>
              <div className="update-status">
                <label>Choose brand:</label>
                <select
                  name="status"
                  id="brand"
                  onChange={(e) =>
                    setFilterData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Brand</option>
                  {brands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="update-status">
                <label>Choose category:</label>
                <select
                  name="status"
                  id="category"
                  onChange={(e) =>
                    setFilterData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="update-status">
                <label>Choose gender:</label>
                <select
                  name="status"
                  id="gender"
                  onChange={(e) =>
                    setFilterData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <button type="submit">Find product</button>
            </form>
          </div>
        </Modal>
      )}

      <Sidebar />
      <div className="listDataContainer">
        <Datatable
          columns={columns}
          path={path}
          actionColumn={actionColumn}
          handleSelected={(ids) => setSelected(ids)}
          action={action}
          actionInput={(value) => setSearching(value)}
          actionFormSubmit={findProduct}
          actionInputId={(value) => setId(value)}
          actionFindById={findById}
          api={productApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ListProducts;
