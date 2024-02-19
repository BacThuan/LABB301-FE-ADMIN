import "../../css/new.css";
import { useState, useEffect, useCallback } from "react";
import { userInputs } from "../../formSource";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import { formatState } from "../../store/convert";
const initData = {
  authProvider: [],
  email: "",
  name: "",
  password: "",
  phone: "",
  role: "",
  state: "",
};

const NewUser = () => {
  const [info, setInfo] = useState(initData);
  const search = useLocation().search;
  const params = new URLSearchParams(search).get("email");
  const token = Cookies.get("token");

  const [roles, setRole] = useState([]);
  const [states, setState] = useState([]);
  const [auths, setAuths] = useState([]);

  const navigate = useNavigate();

  // check valid data
  let valid = false;

  if (
    info.authProvider.length === 0 ||
    info.email === "" ||
    info.name === "" ||
    info.password === "" ||
    info.phone === "" ||
    info.role === "" ||
    info.state === ""
  ) {
    valid = false;
  } else {
    valid = true;
  }

  //-----------

  const getRoles = useCallback(async () => {
    const roles = await axios.get(`${api}/read/roles/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setRole(roles.data);
  });

  const getStates = useCallback(async () => {
    const states = await axios.get(`${api}/read/states-user/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setState(states.data);
  });

  const getAuthProvider = useCallback(async () => {
    const auths = await axios.get(`${api}/read/auths/getAll`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setAuths(auths.data);
  });

  useEffect(() => {
    document.title = params != null ? "Update User" : "Add New User";
    if (!token) navigate("/auth");
    if (params === null) setInfo(initData);
    getRoles();
    getStates();
    getAuthProvider();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (params !== null) {
          const user = await axios.get(`${api}/read/user?email=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = user.data;

          setInfo(data);
          setInfo((prev) => ({
            ...prev,
            oldEmail: data.email,
            changePassword: false,
          }));
        } else setInfo(initData);
      } catch (err) {
        if (window.confirm(err.response.data.message)) {
          navigate("/");
        }
      }
    };
    getUser();
  }, []);

  // change info
  const handleChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  });

  const changePassword = useCallback((e) => {
    if (params !== null && e.target.id === "password") {
      if (window.confirm("Are you sure want to change the password ?")) {
        setInfo((prev) => ({ ...prev, password: "", changePassword: true }));
      }
    }
  });

  // get role option
  const getRoleOption = useCallback((role, index) => {
    // if this room selected
    if (params != null) {
      if (info.role === role) {
        return (
          <option key={index} value={role} selected>
            {role}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={role}>
        {role}
      </option>
    );
  });

  // get state option
  const getStateOption = useCallback((state, index) => {
    // if this room selected
    if (params != null) {
      if (info.state === state) {
        return (
          <option key={index} value={state} selected>
            {formatState(state)}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={state}>
        {formatState(state)}
      </option>
    );
  });

  // get auth provider option
  const getAuthProviderOption = useCallback((auth, index) => {
    // if this room selected
    if (params != null) {
      if (info.authProvider.includes(auth)) {
        return (
          <option key={index} value={auth} selected>
            {auth}
          </option>
        );
      }
    }
    // if not selected
    return (
      <option key={index} value={auth}>
        {auth}
      </option>
    );
  });

  const handleChangeAuth = useCallback((e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setInfo((prev) => ({ ...prev, authProvider: selectedValues }));
  });

  // submit
  const handlesubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      // add new
      if (params === null) {
        await axios.post(`${api}/create/user`, info, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        navigate("/users");
      }
      // update
      else {
        await axios.put(`${api}/update/user`, info, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        navigate("/users");
      }
    } catch (err) {
      if (err.response.data) alert(err.response.data);
      else alert("Some thing wrong!");
    }
  });

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params === null ? "Add New User" : "Update User"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handlesubmit}>
            <div className="formBody">
              <div>
                {userInputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>

                    <input
                      id={input.id}
                      onChange={handleChange}
                      type={input.type}
                      placeholder={input.placeholder}
                      required={true}
                      defaultValue={info ? info[`${input.id}`] : ""}
                      onClick={changePassword}
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="formInput">
                  <label>User role</label>
                  <select
                    name="status"
                    id="role"
                    onChange={handleChange}
                    required={true}
                  >
                    <option value="">Choose a role</option>
                    {roles.map((role, index) => getRoleOption(role, index))}
                  </select>
                </div>

                <div className="formInput">
                  <label>User state</label>
                  <select
                    name="status"
                    id="state"
                    onChange={handleChange}
                    required={true}
                  >
                    <option value="">Choose a state</option>
                    {states.map((state, index) => getStateOption(state, index))}
                  </select>
                </div>

                <div className="formInput">
                  <label>User Auth Provider</label>
                  <select
                    name="status"
                    id="authProvider"
                    onChange={handleChangeAuth}
                    required={true}
                    multiple
                  >
                    {auths.map((auth, index) =>
                      getAuthProviderOption(auth, index)
                    )}
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

export default NewUser;
