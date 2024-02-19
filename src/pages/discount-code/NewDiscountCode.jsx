import "../../css/new.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initData = {
  event: "",
  orderFrom: 0,
  percent: 0,
  numberCodes: 0,
  start: new Date(),
  end: null,
  isActive: null,
};

const NewDiscountCode = () => {
  const search = useLocation().search;
  const params = new URLSearchParams(search).get("id");
  const token = Cookies.get("token");

  const [info, setInfo] = useState(initData);
  const navigate = useNavigate();

  // check valid data
  let valid = false;

  if (
    info.event === "" ||
    info.orderFrom === 0 ||
    info.percent === 0 ||
    info.numberCodes === 0 ||
    info.end === null ||
    info.isActive === null
  ) {
    valid = false;
  } else {
    valid = true;
  }

  useEffect(() => {
    document.title = params === null ? "New Event " : "Update Event";
    if (!token) navigate("/auth");
  }, []);

  useEffect(() => {
    const getEvent = async () => {
      try {
        if (params !== null) {
          const event = await axios.get(`${api}/read/event?id=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = event.data;
          data.start = new Date(data.start);
          data.end = new Date(data.end);
          setInfo(data);
        } else setInfo(initData);
      } catch (err) {
        if (window.confirm(err.response.data.message)) {
          navigate("/");
        }
      }
    };
    getEvent();
  }, [params]);

  // change info
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("event", info.event);
    formData.append("orderFrom", info.orderFrom);
    formData.append("percent", info.percent);
    formData.append("numberCodes", info.numberCodes);
    formData.append("start", info.start);
    formData.append("end", info.end);
    formData.append("isActive", info.isActive);

    try {
      // add new
      if (params === null) {
        if (window.confirm("Are you sure to add new event ?")) {
          await axios.post(`${api}/create/event`, formData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          navigate("/events");
        }
      }
      // update
      else {
        formData.append("id", params);
        if (window.confirm("Are you sure to update this event ?")) {
          info.id = params;
          await axios.put(`${api}/update/event`, formData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          navigate("/events");
        }
      }
    } catch (err) {
      if (window.confirm(err.response.data.message)) {
        navigate("/");
      }
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params === null ? "Add New Event " : "Update Event"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handlesubmit}>
            <div className="formBody">
              <div>
                <div className="formInput">
                  <label>Name Event</label>
                  <input
                    id="event"
                    onChange={handleChange}
                    type="text"
                    placeholder="Name event"
                    required={true}
                    defaultValue={info.event}
                  />
                </div>

                <div className="formInput">
                  <label>Discount for orders from</label>
                  <input
                    id="orderFrom"
                    min={50000}
                    onChange={handleChange}
                    type="number"
                    placeholder="Order from"
                    required={true}
                    value={info.orderFrom}
                  />
                </div>

                <div className="formInput">
                  <label>Discount percent</label>
                  <input
                    id="percent"
                    min={1}
                    onChange={handleChange}
                    type="number"
                    placeholder="Discount percent"
                    required={true}
                    value={info.percent}
                  />
                </div>

                <div className="formInput">
                  <label>Number of discount code</label>
                  <input
                    id="numberCodes"
                    min={1}
                    onChange={handleChange}
                    type="number"
                    placeholder="Number of discount code"
                    required={true}
                    value={info.numberCodes}
                  />
                </div>
              </div>

              <div>
                <div className="formInput">
                  <label>Day start</label>
                  <div className="datePicker">
                    <DatePicker
                      selected={info.start}
                      onChange={(date) =>
                        setInfo((prev) => ({ ...prev, start: date }))
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Day start"
                    />
                  </div>
                </div>

                <div className="formInput">
                  <label>Day end</label>
                  <div className="datePicker">
                    <DatePicker
                      selected={info.end}
                      onChange={(date) => {
                        if (date < info.start)
                          alert("Day end must greater than day start!");
                        else setInfo((prev) => ({ ...prev, end: date }));
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Day end"
                    />
                  </div>
                </div>

                <div className="formInput">
                  <label>Is this event active or not ?</label>
                  <select
                    id="isActive"
                    onChange={handleChange}
                    required={true}
                    // value={JSON.stringify(deliveryOption.district)}
                  >
                    <option value="">Choose state</option>
                    <option
                      value={true}
                      selected={info.isActive ? true : false}
                    >
                      Active
                    </option>

                    <option
                      value={false}
                      selected={info.isActive ? false : true}
                    >
                      Not yet
                    </option>
                  </select>
                </div>
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

export default NewDiscountCode;
