import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import axios from "axios";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import "../../css/list.css";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const initFilter = {
  start: null,
  end: null,
};
const formatDateToDDMMYYYY = (date) => {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  var formattedDate = day + "/" + month + "/" + year;

  return formattedDate;
};
const DiscountCode = ({ columns }) => {
  const navigate = useNavigate();
  const path = "events";
  const token = Cookies.get("token");

  const [searching, setSearching] = useState();
  const [codesApi, setApi] = useState(`${api}/read/${path}?admin=true`);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  // get option of an action
  const [option, setOption] = useState("");
  const [optionValue, setOptionValue] = useState(initFilter);

  useEffect(() => {
    document.title = "List " + "event";
    if (!token) navigate("/auth");
  }, []);

  const action = (action) => {
    if (action === "add") {
      navigate(`/${path}/new`);
    }
    //
    else if (action === "filter") {
      setOption("filter");
    } else if (action === "refetch") {
      setApi(`${api}/read/${path}?admin=true`);
    }
    //
  };

  const onClose = () => {
    setOption("");
    setOptionValue(initFilter);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure want to delete this event? ")) {
        await axios.delete(`${api}/delete/event?id=${id}`, {
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="blueButton"
              to={`/${path}/new?id=${params.row._id}`}
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

  const handleFilter = (e) => {
    e.preventDefault();
    let start = optionValue.start ? optionValue.start : null;
    let end = optionValue.end ? optionValue.end : null;

    let temp = "";

    if (start !== null) temp += `&dayStart=${formatDateToDDMMYYYY(start)}`;
    if (end !== null) temp += `&dayEnd=${formatDateToDDMMYYYY(end)}`;

    setApi(`${api}/read/${path}?admin=true${temp}`);

    onClose();
  };

  const findEvent = () => {
    setApi(`${api}/read/${path}?admin=true&searching=${searching}`);
  };
  return (
    <div className="listData">
      {option === "filter" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">Event Filter</div>

            <form className="update-status" onSubmit={handleFilter}>
              <div className="update-status">
                <label>Day start</label>
                <DatePicker
                  selected={optionValue.start}
                  onChange={(date) =>
                    setOptionValue((prev) => ({ ...prev, start: date }))
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Day start"
                />
              </div>

              <div className="update-status">
                <label>Day end</label>
                <DatePicker
                  selected={optionValue.end}
                  onChange={(date) => {
                    if (date < optionValue.start)
                      alert("Day end must greater than day start!");
                    else setOptionValue((prev) => ({ ...prev, end: date }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Day end"
                />
              </div>

              <button type="submit">Find event</button>
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
          // handleSelected={(ids) => setSelected(ids)}
          action={action}
          actionInput={(value) => setSearching(value)}
          actionFormSubmit={findEvent}
          api={codesApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default DiscountCode;
