import "../../css/list.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import { brandAndCategoryColumns, colorColumns } from "../../datatablesource";

const linkAddBrand = `${api}/create/brand`;
const linkUpdateBrand = `${api}/update/brand`;
const linkAddCategory = `${api}/create/category`;
const linkUpdateCategory = `${api}/update/category`;
const linkAddColor = `${api}/create/color`;
const linkUpdateColor = `${api}/update/color`;

const ListBCC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [searching, setSearching] = useState();
  const [refetch, setRefetch] = useState(false);
  //option is update or add new
  const [option, setOption] = useState("");

  // these variable is to get data of row
  const [row, setRow] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [touch, setTouch] = useState(false);

  // set type of colums, path, api
  const [columns, setColumns] = useState(brandAndCategoryColumns);
  const [path, setPath] = useState("brands");
  const [dataApi, setDataApi] = useState(`${api}/read/${path}?admin=true`);

  useEffect(() => {
    document.title = "Brand/Category/Color";
    if (!token) navigate("/auth");
  }, []);

  useEffect(() => {
    if (touch) setOption("update");
  }, [rowData]);

  useEffect(() => {
    if (path === "brands" || path === "categories") {
      setColumns(brandAndCategoryColumns);
    }
    //
    else if (path === "colors") {
      setColumns(colorColumns);
    }

    setDataApi(`${api}/read/${path}?admin=true`);
  }, [path]);

  const action = (action) => {
    if (action === "refetch") {
      if (dataApi.includes("searching")) {
        let tempApi = dataApi.replace("searching", "nouse");
        setDataApi(`${tempApi}&refetch=true`);
      }
      //
      else setDataApi(`${api}/read/${path}?admin=true`);
    }

    //
    else if (action === "add") {
      setTouch(false);
      setRow(null);
      setRowData(null);
      setOption(action);
    }
    //
    else {
      setPath(action);
      setTouch(false);
      setRow(null);
      setRowData(null);
    }
  };

  const find = () => {
    setDataApi(`${api}/read/${path}?admin=true&searching=${searching}`);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm(`Are you sure want to delete?`)) {
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
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (option === "add") {
        if (path === "brands")
          await axios.post(linkAddBrand, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        //
        else if (path === "categories")
          await axios.post(linkAddCategory, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        else
          await axios.post(linkAddColor, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
      }
      //
      else {
        if (path === "brands")
          await axios.put(linkUpdateBrand, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        //
        else if (path === "categories")
          await axios.put(linkUpdateCategory, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        else
          await axios.put(linkUpdateColor, rowData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
      }
      setTouch(false);
      setOption("");
      setRefetch(!refetch);
    } catch (err) {
      alert(err.response.data);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/**this will get row id to return data in table */}
            <button
              className="blueButton"
              onClick={() => {
                setTouch(true);
                setRow(params.row._id);
              }}
            >
              Edit
            </button>

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
      {option !== "" && (
        <Modal onClose={() => setOption("")}>
          <div className="modalContainer">
            <div className="modal-title">
              {option === "add" ? "Add" : "Update"} {path}
            </div>
            <form className="update-status" onSubmit={handleSubmit}>
              <div className="update-status">
                <label>Name:</label>
                <input
                  type="text"
                  id="name"
                  onChange={(e) =>
                    setRowData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  defaultValue={rowData != null ? rowData.name : ""}
                  required={true}
                />
              </div>

              {path === "colors" && (
                <div className="update-status">
                  <label>Code:</label>
                  <input
                    type="color"
                    id="code"
                    onChange={(e) =>
                      setRowData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    defaultValue={rowData != null ? rowData.code : ""}
                    required={true}
                  />
                </div>
              )}
              <button type="submit">
                {option === "add" ? "Add" : "Update"}
              </button>
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
          row={row}
          getRowData={(value) => setRowData(value)}
          // handleSelected={(ids) => setSelected(ids)}
          action={action}
          actionInput={(value) => setSearching(value)}
          actionFormSubmit={find}
          api={dataApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};
export default ListBCC;
