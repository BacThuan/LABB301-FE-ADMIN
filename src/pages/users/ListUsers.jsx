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
const ListUsers = ({ columns }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const token = Cookies.get("token");

  const [roles, setRole] = useState([]);
  const [states, setState] = useState([]);

  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState();

  // get option of an action
  const [option, setOption] = useState("");
  const [multi, setMulti] = useState(false);

  const [user, setUser] = useState("");
  const [optionValue, setOptionValue] = useState("");

  const [userApi, setUserApi] = useState(`${api}/read/${path}?admin=true`);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  // for send email
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });

  // for filter
  const [filterData, setFilterData] = useState({
    time: 0,
    unit: "",
  });

  // find by id
  const [id, setId] = useState(null);

  const onClose = () => {
    setOption("");
    setMulti(false);
    setUser("");
    setOptionValue("");
  };

  const getRoles = async () => {
    const roles = await axios.get(`${api}/read/roles/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setRole(roles.data);
  };

  const getStates = async () => {
    const states = await axios.get(`${api}/read/states-user/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setState(states.data);
  };

  useEffect(() => {
    document.title = "List " + path;
    if (!token) navigate("/auth");
    getRoles();
    getStates();
  }, []);

  const openChange = (email, option) => {
    setOption(option);
    setUser(email);
  };
  //
  const handleWriteEmail = (e) => {
    setEmailData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Are you sure want to delete data of "${email}?"`)) {
      try {
        await axios.delete(`${api}/delete/${path}?email=${email}`, {
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
      navigate(`/${path}/new`);
    }
    //
    else if (action === "refetch") {
      setUserApi(`${api}/read/${path}?admin=true`);
    }
    //
    else if (selected.length === 0) {
      alert("Select at least one user!");
    }
    //
    else {
      // set role
      if (action === "role") {
        setOption("role");
        setMulti(true);
      }

      // set state
      if (action === "state") {
        setOption("state");
        setMulti(true);
      }

      // send emails
      if (action === "email") {
        setOption("email");
      }
    }
  };

  const handleUpdate = async (option) => {
    if (optionValue === "") {
      alert("Please select an option!");
    }
    // update one
    else if (!multi) {
      if (
        window.confirm(`Are you sure want to update ${option} of "${user}?"`)
      ) {
        try {
          let data = { email: user };

          if (option === "role") data.role = optionValue;

          if (option === "state") data.state = optionValue;

          await axios.put(`${api}/update/${path}/update-one`, data, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          onClose();
          setRefetch(!refetch);
        } catch (err) {
          alert(err.response.data);
        }
      }
    }

    // update many
    else {
      if (
        window.confirm(`Are you sure want to update ${option} of these users?`)
      ) {
        try {
          let data = { emails: selected };

          if (option === "role") data.role = optionValue;

          if (option === "state") data.state = optionValue;

          await axios.put(`${api}/update/${path}/update-many`, data, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          onClose();
          setRefetch(!refetch);
        } catch (err) {
          alert(err.response.data);
        }
      }
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure want to send email for these users?`)) {
      try {
        let data = { emails: selected, emailData: emailData };

        await axios.post(`${api}/create/${path}/send-email`, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        onClose();
      } catch (err) {
        // alert(err.response.data);
        alert(err.response.data);
      }
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    if (filterData.time == 0 || filterData.unit === "") {
      alert("Time and unit must not be empty!");
    }
    //
    else {
      setUserApi(
        `${api}/read/${path}?admin=true&time=${filterData.time}&unit=${filterData.unit}`
      );
      setOption("");
    }
  };
  const findUser = () => {
    setUserApi(`${api}/read/${path}?admin=true&searching=${searching}`);
  };
  const findById = () => {
    setUserApi(`${api}/read/${path}?admin=true&userId=${id}`);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="greenButton"
              onClick={() => openChange(params.row.email, "role")}
            >
              Change Role
            </div>
            <div
              className="blueButton"
              onClick={() => openChange(params.row.email, "state")}
            >
              Change State
            </div>

            <Link
              className="purpleButton"
              to={`/${path}/new?email=${params.row.email}`}
            >
              Edit
            </Link>

            <div
              className="redButton"
              onClick={() => handleDelete(params.row.email)}
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
      {/* option for update role */}
      {option === "role" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">Choose role for user!</div>
            <form
              className="update-status"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(option);
              }}
            >
              <select
                name="status"
                id="status"
                onChange={(e) => setOptionValue(e.target.value)}
              >
                <option value="">Choose a role</option>
                {roles.map((role, index) => {
                  return (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  );
                })}
              </select>
              <button type="submit">Update role</button>
            </form>
          </div>
        </Modal>
      )}

      {/* option for update state */}
      {option === "state" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="model-title">Choose state for user!</div>
            <form
              className="update-status"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(option);
              }}
            >
              <select
                name="status"
                id="status"
                onChange={(e) => setOptionValue(e.target.value)}
              >
                <option value="">Choose a state</option>
                {states.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {formatState(state)}
                    </option>
                  );
                })}
              </select>
              <button type="submit">Update state</button>
            </form>
          </div>
        </Modal>
      )}

      {/* option for send email */}
      {option === "email" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">Send email for users!</div>
            <form onSubmit={handleSendEmail}>
              <label>Subject</label>
              <input
                type="text"
                id="subject"
                onChange={handleWriteEmail}
                required={true}
              />

              <label>Content</label>
              <textarea
                id="content"
                onChange={handleWriteEmail}
                required={true}
              />

              <button type="submit">Send email</button>
            </form>
          </div>
        </Modal>
      )}

      {/* option for filter */}
      {option === "filter" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">User Filter</div>
            <p>
              Filter users who have not logged in to the system within a certain
              time from now.
            </p>
            <form className="update-status" onSubmit={handleFilter}>
              <div>
                <label>Type your time:</label>
                <input
                  type="number"
                  id="number"
                  onChange={(e) =>
                    setFilterData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  required={true}
                />
              </div>
              <div className="update-status">
                <label>Choose an unit:</label>
                <select
                  name="status"
                  id="status"
                  onChange={(e) =>
                    setFilterData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                >
                  <option value="">Choose a type of time</option>
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                  <option value="years">years</option>
                </select>
              </div>

              <button type="submit">Find users</button>
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
          handleSelected={(emails) => setSelected(emails)}
          action={action}
          actionInput={(value) => setSearching(value)}
          actionFormSubmit={findUser}
          actionInputId={(value) => setId(value)}
          actionFindById={findById}
          api={userApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ListUsers;
