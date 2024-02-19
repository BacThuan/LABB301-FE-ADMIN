import "../../css/new.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import { orderInputs } from "../../formSource";
import { formatState, convert, formatDate } from "../../store/convert";
import Table from "react-bootstrap/Table";
import ListItem from "../products/ListItem";
import { productItemColumns } from "../../datatablesource";
import { useSelector, useDispatch } from "react-redux";

// decrement button
const left = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512">
    <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
  </svg>
);

// increment button
const right = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512">
    <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
  </svg>
);
const trash = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    width="15"
    viewBox="0 0 448 512"
  >
    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
  </svg>
);

const paymentMethod = ["Credit card", "Pay when received"];
const countTotal = (itemsQuantity) => {
  let tempTotal = 0;
  itemsQuantity.forEach((item) => {
    tempTotal += item.price * item.quantity;
  });

  return tempTotal;
};

// get item qauntity
const getItemQuantity = (orderData, arrayItemQuantity) => {
  orderData.forEach((item) => {
    arrayItemQuantity.push({
      id: item.idItem,
      quantity: item.quantity,
      price: item.price,
      leftOver: item.leftOver,
    });
  });
};

const NewOrder = () => {
  const dispatch = useDispatch();

  const [info, setInfo] = useState({});

  const [orderData, setOrderData] = useState([]);
  const [itemQuantity, setIteamQuantity] = useState([]); // id end quantity of each item for add
  const [total, setTotal] = useState(0);

  const search = useLocation().search;

  const params = new URLSearchParams(search).get("id");
  const listIdItems = useSelector((state) => state.listIdItems);

  const navigate = useNavigate();

  const token = Cookies.get("token");

  const [statesPayment, setStatePaymanet] = useState([]);
  const [statesOrder, setStateOrder] = useState([]);

  const [option, setOption] = useState("");

  const getStatesPayment = useCallback(async () => {
    const states = await axios.get(`${api}/read/states-payment/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setStatePaymanet(states.data);
  });

  const getStatesOrder = useCallback(async () => {
    const states = await axios.get(`${api}/read/states-order/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setStateOrder(states.data);
  });

  const onClose = () => {
    setOption("");
  };

  const resetState = () => {
    setInfo({});

    setOrderData([]);
    setIteamQuantity([]); // id end quantity of each item for add and update
    setTotal(0);

    setStatePaymanet([]);
    setStateOrder([]);

    setOption("");
  };

  const handleChangeQuantity = (index, type, e) => {
    let temp = itemQuantity[index];
    if (type === "-") {
      if (temp.quantity > 1) {
        setTotal(total - temp.price);
        itemQuantity[index].quantity -= 1;
        itemQuantity[index].leftOver += 1;
      }
    }

    //
    else if (type === "+") {
      if (temp.leftOver === 0) alert("No more items in store!");
      else {
        setTotal(total + temp.price);
        itemQuantity[index].quantity += 1;
        itemQuantity[index].leftOver -= 1;
      }
    }
    //
    else {
      if (e.target.value > temp.leftOver)
        alert("Too many items for left over in store");
      else {
        let gap = Number(e.target.value) - temp.quantity;

        setTotal(total + gap * temp.price);
        itemQuantity[index].leftOver -= gap;
        itemQuantity[index].quantity = Number(e.target.value);
      }
    }
    // console.log(temp);
    setIteamQuantity(itemQuantity);
  };

  useEffect(() => {
    document.title = params === null ? "New Order " : "Update Order";
    if (!token) navigate("/auth");
    getStatesPayment();
    getStatesOrder();

    return () => {
      dispatch({ type: "REMOVE_LISTID" });
    };
  }, []);

  useEffect(() => {
    if (params === null) resetState();
  }, [params]);

  useEffect(() => {
    const getOrder = async () => {
      try {
        if (params !== null) {
          let tempItemsQuantity = [];
          let tempOrderData = [];

          // old data
          const order = await axios.get(`${api}/read/order?id=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = order.data;
          const orderData = data.orderData;

          // display order data
          tempOrderData.push(...orderData);

          getItemQuantity(orderData, tempItemsQuantity);
          setIteamQuantity(tempItemsQuantity);
          setOrderData(tempOrderData);

          delete data.orderData;
          setInfo(data);

          // count total
          setTotal(countTotal(tempItemsQuantity));
        }
        //
      } catch (err) {
        if (window.confirm(err.response.data)) {
          navigate("/");
        }
      }
    };
    getOrder();
  }, []);

  useEffect(() => {
    // add new data
    const getData = async () => {
      try {
        let tempItemsQuantity = [];
        let tempOrderData = [];

        // get add new item
        if (listIdItems.length > 0) {
          const addNew = await axios.post(
            `${api}/read/order/getOrderItem`,
            listIdItems,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          const newData = addNew.data;
          // put new data
          tempOrderData.push(...newData);
          getItemQuantity(newData, tempItemsQuantity);

          setIteamQuantity(tempItemsQuantity);
          setOrderData(tempOrderData);

          // count total
          setTotal(countTotal(tempItemsQuantity));
        }

        //
      } catch (err) {
        alert(err.response.data);
        dispatch({ type: "REMOVE_LISTID" });
      }
    };
    getData();
  }, [option]);

  // change info
  const handleChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  });

  // submit
  const handlesubmit = useCallback(async (e) => {
    e.preventDefault();

    if (itemQuantity.length === 0) alert("Add aleast 1 product item!");
    else {
      const formData = {
        info: info,
      };

      try {
        if (params !== null) {
          formData.idOrder = params;
          if (window.confirm("Are you sure want to update order data?")) {
            await axios.put(`${api}/update/orders`, formData, {
              headers: {
                Authorization: "Bearer " + token,
              },
            });

            navigate("/orders");
          }
        }

        // create new
        else {
          formData.itemQuantity = itemQuantity;
          formData.total = total;
          if (window.confirm("Are you sure want to add new order?")) {
            await axios.post(`${api}/create/orders`, formData, {
              headers: {
                Authorization: "Bearer " + token,
              },
            });

            navigate("/orders");
          }
        }
      } catch (err) {
        if (err.response.data) {
          alert(err.response.data);
        }

        navigate("/orders");
      }
    }
  });

  const getOption = (data, index, option) => {
    let variable = info.state;

    if (option === "method") variable = info.method;

    if (option === "payment") variable = info.payment;

    if (option === "delivery") variable = info.delivery;

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

  const handleAddNew = () => {
    // navigate("/items?getOrderId=true");
    setOption("add");
  };

  const addSuccess = () => {
    onClose();
  };

  const deleteItem = (id, index) => {
    let deleteData = itemQuantity[index];

    let newItemsQuantity = itemQuantity.filter((item) => item.id != id);
    let newOrderData = orderData.filter((data) => data.idItem != id);

    setIteamQuantity(newItemsQuantity);
    setOrderData(newOrderData);

    setTotal(total - deleteData.price * deleteData.quantity);
  };

  return (
    <div className="new">
      <Sidebar />
      {option === "add" && (
        <div>
          <div className="backdrop" onClick={onClose}></div>
          <div className="addNewItems">
            <ListItem
              columns={productItemColumns}
              addState={true}
              addSuccess={addSuccess}
            />
          </div>
        </div>
      )}
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params == null ? "Add New Order" : "Update Order"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handlesubmit}>
            <div className="formBody">
              <div>
                {params !== null && (
                  <div className="formInput">
                    <label>User Account Id</label>
                    <input
                      id="idUser"
                      type="text"
                      defaultValue={info.idUser}
                      readOnly={true}
                    />
                  </div>
                )}
                {orderInputs.map((input) => {
                  return (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        onChange={handleChange}
                        defaultValue={info ? info[`${input.id}`] : ""}
                        required={true}
                      />
                    </div>
                  );
                })}
                {params !== null && (
                  <div className="formInput">
                    <label>User Address</label>
                    <input
                      id="address"
                      type="text"
                      defaultValue={info.address}
                      readOnly={true}
                    />
                  </div>
                )}
              </div>

              <div>
                {params && (
                  <div className="formInput">
                    <label>Method</label>
                    <select
                      name="status"
                      id="method"
                      onChange={handleChange}
                      required={true}
                    >
                      <option value="">Choose method</option>
                      {paymentMethod.map((method, index) =>
                        getOption(method, index, "method")
                      )}
                    </select>
                  </div>
                )}
                {params && (
                  <div className="formInput">
                    <label>Payment State</label>
                    <select
                      name="status"
                      id="payment"
                      onChange={handleChange}
                      required={true}
                    >
                      <option value="">Choose payment state</option>
                      {statesPayment.map((payment, index) =>
                        getOption(payment, index, "payment")
                      )}
                    </select>
                  </div>
                )}

                {params && (
                  <div className="formInput">
                    <label>Delivery State</label>
                    <select
                      name="status"
                      id="delivery"
                      onChange={handleChange}
                      required={true}
                    >
                      <option value="">Choose delivery state</option>
                      {statesOrder.map((delivery, index) =>
                        getOption(delivery, index, "delivery")
                      )}
                    </select>
                  </div>
                )}
                <div className="formInput">
                  <label>Total</label>
                  <p>{convert(String(total))}</p>
                </div>
                {params !== null && (
                  <div className="formInput">
                    <label>Order day</label>
                    <p>{formatDate(info.orderDay)}</p>
                  </div>
                )}
              </div>
            </div>
            {!params && (
              <button type="button" onClick={handleAddNew}>
                Add new item
              </button>
            )}
            <Table className="table">
              <thead>
                <tr>
                  <th>ID ITEM</th>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>COLOR</th>
                  <th>SIZE</th>
                  <th>GENDER</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  {!params && <th>REMOVE</th>}
                </tr>
              </thead>
              <tbody>
                {orderData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.idItem}</td>
                      <td>
                        <img className="imgOrder" src={item.img} />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td>{item.gender}</td>
                      <td>
                        {!params && (
                          <button
                            type="button"
                            className="handle"
                            onClick={() =>
                              handleChangeQuantity(index, "-", null)
                            }
                          >
                            {left}
                          </button>
                        )}
                        <input
                          className="input"
                          type="number"
                          min={1}
                          id={item.idItem}
                          value={itemQuantity[index].quantity}
                          onChange={(e) => handleChangeQuantity(index, null, e)}
                        />
                        {!params && (
                          <button
                            type="button"
                            className="handle"
                            onClick={() =>
                              handleChangeQuantity(index, "+", null)
                            }
                          >
                            {right}
                          </button>
                        )}
                      </td>
                      <td>{convert(String(item.price))}</td>
                      {!params && (
                        <td
                          className="trash"
                          onClick={() => deleteItem(item.idItem, index)}
                        >
                          {trash}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <br></br>
            <button type="submit">
              {params == null ? "Create" : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
