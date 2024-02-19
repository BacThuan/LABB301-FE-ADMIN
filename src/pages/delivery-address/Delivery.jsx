import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import axios from "axios";
import { api } from "../../api/api";
import React, { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import Cookies from "js-cookie";
import "../../css/list.css";
import { Link, useNavigate } from "react-router-dom";

import {
  getApiCities,
  getApiDistricts,
  getApiWard,
} from "../../store/delivery";

const initFilter = {
  province: null,
  district: null,
  ward: null,
};

const Delivery = ({ columns }) => {
  const navigate = useNavigate();
  const path = "delivery";
  const token = Cookies.get("token");
  const [searching, setSearching] = useState();

  // get option of an action
  const [option, setOption] = useState("");
  const [optionValue, setOptionValue] = useState(initFilter);

  const [deliveryApi, setApi] = useState(`${api}/read/deliveries?admin=true`);

  // variable for refetch api
  const [refetch, setRefetch] = useState(false);

  // get address infomation to count delivery
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  const getCities = async () => {
    setOptionValue(initFilter);

    const data = await getApiCities();
    let arr = [];
    data.forEach((city) => {
      arr.push({
        idCity: city.ProvinceID,
        nameCity: city.ProvinceName,
      });
    });
    setProvince(arr);
  };

  const getDistricts = async (idCity) => {
    const data = await getApiDistricts(idCity);
    let arr = [];
    data.forEach((district) => {
      arr.push({
        idDistrict: district.DistrictID,
        nameDistrict: district.DistrictName,
      });
    });

    setDistrict(arr);
  };

  const getWard = async (district) => {
    const res = await getApiWard(district);
    if (res.data.data) {
      const data = res.data.data;

      let arr = [];
      data.forEach((ward) => {
        arr.push({
          idWard: ward.WardCode,
          nameWard: ward.WardName,
        });
      });

      setWard(arr);
    } else setWard([]);
  };

  const onClose = () => {
    setOption("");
    setOptionValue(initFilter);
  };

  useEffect(() => {
    document.title = "List " + path;
    if (!token) navigate("/auth");
    getCities();
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
      setApi(`${api}/read/deliveries?admin=true`);
    }
    //
  };

  const findDelivery = () => {
    setApi(`${api}/read/deliveries?searching=${searching}`);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure want to delete this delivery? ")) {
        await axios.delete(`${api}/delete/${path}?id=${id}`, {
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
      width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="blueButton"
              to={"/delivery/new/?id=" + params.row._id}
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
  const handleChooseDelivery = (e) => {
    let id = e.target.id;
    let data = JSON.parse(e.target.value);

    setOptionValue((prev) => ({ ...prev, [id]: data }));

    if (id === "province") {
      getDistricts(data);
    }
    if (id === "district") {
      getWard(data);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    let city = optionValue.province ? optionValue.province.nameCity : null;
    let district = optionValue.district
      ? optionValue.district.nameDistrict
      : null;
    let ward = optionValue.ward ? optionValue.ward.nameWard : null;

    let temp = "";

    if (city !== null) temp += `&city=${city}`;
    if (district !== null) temp += `&district=${district}`;
    if (ward !== null) temp += `&ward=${ward}`;

    setApi(`${api}/read/deliveries?admin=true${temp}`);

    onClose();
  };

  return (
    <div className="listData">
      {option === "filter" && (
        <Modal onClose={onClose}>
          <div className="modalContainer">
            <div className="modal-title">Product Filter</div>

            <form className="update-status" onSubmit={handleFilter}>
              <div className="update-status">
                <label>City</label>
                <select
                  id="province"
                  onChange={handleChooseDelivery}
                  value={JSON.stringify(optionValue.province)}
                >
                  <option value="">Choose city</option>
                  {province.map((city, index) => {
                    return (
                      <option key={index} value={JSON.stringify(city)}>
                        {city.nameCity}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="update-status">
                <label>District</label>
                <select
                  id="district"
                  onChange={handleChooseDelivery}
                  value={JSON.stringify(optionValue.district)}
                >
                  <option value="">Choose district</option>
                  {district.map((district, index) => {
                    return (
                      <option key={index} value={JSON.stringify(district)}>
                        {district.nameDistrict}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="update-status">
                <label>Ward</label>
                <select
                  id="ward"
                  onChange={handleChooseDelivery}
                  value={JSON.stringify(optionValue.ward)}
                >
                  <option value="">Choose ward</option>
                  {ward.map((ward, index) => {
                    return (
                      <option key={index} value={JSON.stringify(ward)}>
                        {ward.nameWard}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button type="submit">Find delivery shop</button>
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
          actionFormSubmit={findDelivery}
          api={deliveryApi}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default Delivery;
