import "../../css/list.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import { formatState } from "../../store/convert";
const initFilter = {
  quantity: null,
  size: null,
  state: null,
  price: null,
  color: null,
};

const ListItem = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const path = "items";
  const token = Cookies.get("token");

  const search = useLocation().search;
  const idProduct = new URLSearchParams(search).get("idProduct");
  let tempApi;

  if (idProduct)
    tempApi = `${api}/read/items?admin=true&idProduct=${idProduct}`;
  else tempApi = `${api}/read/items?admin=true`;

  const [addOrderState, setAddOrderState] = useState(false);

  const [colors, setColors] = useState([]);
  const [states, setState] = useState([]);

  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState("");

  const [option, setOption] = useState("");

  const [dataApi, setDataApi] = useState(tempApi);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);
  const [filterData, setFilterData] = useState(initFilter);

  // find by id
  const [id, setId] = useState(null);

  const onClose = () => {
    setOption("");
  };

  const getColors = async () => {
    const colors = await axios.get(`${api}/read/colors/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    let colorsName = [];
    colors.data.map((data) => colorsName.push(data.name));
    setColors(colorsName);
  };

  const getStates = async () => {
    const states = await axios.get(`${api}/read/states-product/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setState(states.data);
  };

  useEffect(() => {
    document.title = "List " + "items";
    if (!token) navigate("/auth");
    getColors();
    getStates();

    if (props.addState) setAddOrderState(true);
  }, []);

  useEffect(() => {
    if (idProduct == null) setDataApi(`${api}/read/items?admin=true`);
  }, [idProduct]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Are you sure want to delete this item. All information and images will be delete too ?`
      )
    ) {
      try {
        await axios.delete(`${api}/delete/items?id=${id}`, {
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
      // normal state
      if (!addOrderState) {
        navigate("/products?getId=true");
      }

      // for add more data to an order
      else {
        if (selected.length === 0) alert("Choose at least 1 item!");
        else {
          dispatch({ type: "ADD_ITEM", listIdItems: selected });
          props.addSuccess();
        }
      }
    }
    //
    else if (action === "refetch") {
      setDataApi(tempApi);
    }
  };

  const findItem = () => {
    setDataApi(`${api}/read/items?admin=true&searching=${searching}`);
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    if (filterData.quantity) tempApi += `&quantity=${filterData.quantity}`;

    if (filterData.size) tempApi += `&size=${filterData.size}`;

    if (filterData.state) tempApi += `&state=${filterData.state}`;

    if (filterData.price) {
      let price = filterData.price;
      if (price.includes("<")) {
        price = price.replace("<", "");
        tempApi += `&lt=${price}`;
      }
      //
      else if (price.includes("-")) {
        let limit = price.split("-");
        tempApi += `&gt=${limit[0]}&lt=${limit[1]}`;
      }
      //
      else {
        price = price.replace(">", "");
        tempApi += `&gt=${price}`;
      }
    }
    if (filterData.color) tempApi += `&color=${filterData.color}`;
    setDataApi(tempApi);

    setFilterData(initFilter);

    onClose();
  };

  const findById = () => {
    setDataApi(`${api}/read/${path}?admin=true&itemId=${id}`);
  };

  const filter = (e) => {
    setFilterData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="purpleButton"
              to={`/items/new?idProduct=${params.row.product_id}&id=${params.row._id}`}
            >
              Edit
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
                <label>Quantity:</label>
                <input type="number" id="quantity" onChange={filter} />
              </div>

              <div className="update-status">
                <label>Size:</label>
                <input type="number" id="size" onChange={filter} />
              </div>

              <div className="update-status">
                <label>Choose color:</label>
                <select name="status" id="color" onChange={filter}>
                  <option value="">Color</option>
                  {colors.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="update-status">
                <label>Choose state:</label>
                <select name="status" id="state" onChange={filter}>
                  <option value="">State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {formatState(state)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="update-status">
                <label>Choose price :</label>
                <select name="status" id="price" onChange={filter}>
                  <option value="">Price</option>

                  <option value="<1000000"> &lt; 1.000.000</option>
                  <option value="1000000-2000000">1.000.000 - 2.000.000</option>
                  <option value="2000000-3000000">2.000.000 - 3.000.000</option>
                  <option value=">3000000"> &gt; 3.000.000</option>
                </select>
              </div>

              <button type="submit">Find product</button>
            </form>
          </div>
        </Modal>
      )}
      {!addOrderState && <Sidebar />}
      <div className="listDataContainer">
        <Datatable
          columns={props.columns}
          path={"items"}
          actionColumn={addOrderState ? "" : actionColumn}
          handleSelected={(ids) => setSelected(ids)}
          action={action}
          actionInput={(value) => setSearching(value)}
          actionFormSubmit={findItem}
          actionInputId={(value) => setId(value)}
          actionFindById={findById}
          api={dataApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ListItem;
