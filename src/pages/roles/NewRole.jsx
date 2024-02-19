import "../../css/new.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import { roleInputs } from "../../formSource";
const NewRole = () => {
  const [permission, setListPermission] = useState(null);

  const search = useLocation().search;

  const params = new URLSearchParams(search).get("id");

  const navigate = useNavigate();

  const token = Cookies.get("token");

  useEffect(() => {
    document.title = "Role Management";
    if (!token) navigate("/auth");
  }, []);

  useEffect(() => {
    const getRole = async () => {
      try {
        if (params !== null) {
          const role = await axios.get(`${api}/read/role?idRole=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = role.data;
          setListPermission(data);
        } else {
          setListPermission(null);
        }
      } catch (err) {
        // console.log(err);
        if (window.confirm(err.response.data)) {
          navigate("/roles");
        }
      }
    };
    getRole();
  }, [params]);

  // change info
  const handleChange = useCallback((e) => {
    setListPermission((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
  });

  // submit
  const handlesubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (params !== null) {
        permission.id = params;
        if (window.confirm("Are you sure want to change?")) {
          await axios.put(`${api}/update/role`, permission, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          navigate("/roles");
        }
      }

      // create new
      else {
        if (window.confirm("Are you sure want to add new permission?")) {
          await axios.post(`${api}/create/role`, permission, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          navigate("/roles");
        }
      }
    } catch (err) {
      if (err.response.data) {
        alert(err.response.data);
      }
      console.log(err);
    }
  });

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params == null ? "Add New Role" : "Update Role"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handlesubmit}>
            <div className="formInput">
              <label>Role Name</label>
              <input
                onChange={(e) =>
                  setListPermission((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                type="text"
                placeholder="Type name of the role"
                required={true}
                defaultValue={permission ? permission.roleName : ""}
              />
              <div className="checkBox">
                {roleInputs.map((input) => (
                  <div className="permission">
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      checked={permission ? permission[`${input.id}`] : false}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>

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

export default NewRole;
