import "../../css/list.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import { formatState } from "../../store/convert";
const initFilter = {
  delivery: "",
  payment: "",
};

const ListOrders = ({ columns }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const token = Cookies.get("token");

  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState();

  // get option of an action
  const [option, setOption] = useState("");

  const [optionValue, setOptionValue] = useState("");

  const [orderApi, setApi] = useState(`${api}/read/${path}?admin=true`);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  const [statesPayment, setStatePaymanet] = useState([]);
  const [statesOrder, setStateOrder] = useState([]);
  const [filterData, setFilterData] = useState(initFilter);

  // find by id
  const [id, setId] = useState(null);

  const getStatesPayment = async () => {
    const states = await axios.get(`${api}/read/states-payment/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setStatePaymanet(states.data);
  };

  const getStatesOrder = async () => {
    const states = await axios.get(`${api}/read/states-order/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setStateOrder(states.data);
  };

  const onClose = () => {
    setOption("");
    setOptionValue("");
  };

  useEffect(() => {
    document.title = "List " + path;
    if (!token) navigate("/auth");
    getStatesOrder();
    getStatesPayment();
  }, []);

  const action = (action) => {
    if (action === "filter") {
      setOption("filter");
    }
    //
    else if (action === "add") {
      navigate(`/${path}/new`);
    }
    //
    else if (action === "refetch") {
      setApi(`${api}/read/${path}?admin=true`);
    }
    //
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure want to delete this order? ")) {
        await axios.delete(`${api}/delete/${path}?idOrder=${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setRefetch(!refetch);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setApi(
      `${api}/read/${path}?admin=true&paymentState=${filterData.payment}&deliveryState=${filterData.delivery}`
    );

    setFilterData(initFilter);
    onClose();
  };

  const findOrder = () => {
    setApi(`${api}/read/${path}?searching=${searching}`);
  };

  const findById = () => {
    setApi(`${api}/read/${path}?admin=true&orderId=${id}`);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="blueButton"
              to={"/orders/new/?id=" + params.row._id}
            >
              Edit / Details
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
            <div className="modal-title">
              Choose the permission you want to filter!
            </div>
            <form className="update-status" onSubmit={handleFilter}>
              <div className="update-status">
                <label>Choose payment state:</label>
                <select
                  id="payment"
                  onChange={(e) =>
                    setFilterData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Payment State</option>
                  {statesPayment.map((state, index) => (
                    <option key={index} value={state}>
                      {formatState(state)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="update-status">
                <label>Choose delivery state:</label>
                <select
                  id="delivery"
                  onChange={(e) =>
                    setFilterData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Delivery State</option>
                  {statesOrder.map((state, index) => (
                    <option key={index} value={state}>
                      {formatState(state)}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit">Find order</button>
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
          actionFormSubmit={findOrder}
          actionInputId={(value) => setId(value)}
          actionFindById={findById}
          api={orderApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ListOrders;
