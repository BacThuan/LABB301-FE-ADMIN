import "../../css/list.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import { roleInputs } from "../../formSource";
const initFilter = {
  create: false,
  read: false,
  update: false,
  delete: false,
};

const ListRoles = ({ columns }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const token = Cookies.get("token");

  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState();

  // get option of an action
  const [option, setOption] = useState("");

  const [optionValue, setOptionValue] = useState(initFilter);

  const [roleApi, setRoleApi] = useState(`${api}/read/${path}?admin=true`);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  const onClose = () => {
    setOption("");
    setOptionValue(initFilter);
  };

  useEffect(() => {
    if (!token) navigate("/auth");
    document.title = "List " + path;
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
      if (roleApi.includes("searching")) {
        let tempApi = roleApi.replace("searching", "nouse");
        setRoleApi(`${tempApi}&refetch=true`);
      }
      //
      else setRoleApi(`${api}/read/${path}?admin=true`);
    }
    //
  };

  const findRole = () => {
    setRoleApi(`${api}/read/${path}?admin=true&searching=${searching}`);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure want to delete this role? ")) {
        await axios.delete(`${api}/delete/${path}?idRole=${id}`, {
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

  // change info
  const handleChange = (e) => {
    setOptionValue((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
  };

  const handleFilter = () => {
    setRoleApi(
      `${api}/read/${path}?admin=true&create=${optionValue.create}&read=${optionValue.read}&update=${optionValue.update}&delete=${optionValue.delete}`
    );
    setOption("");
    setOptionValue(initFilter);
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
              to={"/roles/new/?id=" + params.row._id}
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
            <form
              className="update-status"
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter();
              }}
            >
              <div className="checkBox">
                {roleInputs.map((input, index) => (
                  <div className="permission" key={index}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
              <button type="submit">Find role</button>
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
          actionFormSubmit={findRole}
          api={roleApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ListRoles;
