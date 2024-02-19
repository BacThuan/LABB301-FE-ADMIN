import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Cookies from "js-cookie";

import {
  getApiCities,
  getApiDistricts,
  getApiWard,
} from "../../store/delivery";

const initOption = {
  province: null,
  district: null,
  ward: null,
  address: "",
};

const NewDelivery = () => {
  const path = " delivery";
  const token = Cookies.get("token");
  const [deliveryOption, setDeliveryOption] = useState(initOption);

  const search = useLocation().search;
  const params = new URLSearchParams(search).get("id");

  // get address infomation to count delivery
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  const navigate = useNavigate();

  // check valid data
  let valid = false;

  if (
    deliveryOption.province === null ||
    deliveryOption.district === null ||
    deliveryOption.ward === null ||
    deliveryOption.address === ""
  ) {
    valid = false;
  } else {
    valid = true;
  }

  const getCities = async () => {
    setDeliveryOption(initOption);

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

  const handleChooseDelivery = (e) => {
    let id = e.target.id;
    let data = JSON.parse(e.target.value);

    setDeliveryOption((prev) => ({ ...prev, [id]: data }));

    if (id === "province") {
      getDistricts(data);
      setWard([]);
    }
    if (id === "district") {
      getWard(data);
    }
  };

  useEffect(() => {
    if (!token) navigate("/auth");

    const getDelivery = async () => {
      try {
        if (params !== null) {
          const data = await axios.get(`${api}/read/delivery?id=${params}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          setDeliveryOption(data.data);
        }
        //
      } catch (err) {
        if (window.confirm(err.response.data.message)) {
          navigate("/");
        }
      }
    };

    getDelivery();
    getCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("city", deliveryOption.province.nameCity);
      formData.append("fastDeliveryCodeCity", deliveryOption.province.idCity);
      formData.append("district", deliveryOption.district.nameDistrict);
      formData.append(
        "fastDeliveryCodeDistrict",
        deliveryOption.district.idDistrict
      );
      formData.append("ward", deliveryOption.ward.nameWard);
      formData.append("fastDeliveryCodeWard", deliveryOption.ward.idWard);
      formData.append("address", deliveryOption.address);

      // add new
      if (params === null) {
        await axios.post(`${api}/create/delivery-shop`, formData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      }

      // update
      else {
        formData.append("id", params);
        await axios.put(`${api}/update/delivery-shop`, formData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      }

      navigate("/delivery");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="newhtop">
          <h1>{params === null ? "Add New Delivery " : "Update Delivery"}</h1>
        </div>
        <div className="newhForm">
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              <div>
                <div className="formInput">
                  <label>City</label>
                  <select
                    id="province"
                    onChange={handleChooseDelivery}
                    required={true}
                  >
                    <option value="">Choose city</option>
                    {province.length > 0 &&
                      province.map((city, index) => {
                        return (
                          <option key={index} value={JSON.stringify(city)}>
                            {city.nameCity}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="formInput">
                  <label>District</label>
                  <select
                    id="district"
                    onChange={handleChooseDelivery}
                    required={true}
                  >
                    <option value="">Choose district</option>
                    {district.length > 0 &&
                      district.map((district, index) => {
                        return (
                          <option key={index} value={JSON.stringify(district)}>
                            {district.nameDistrict}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="formInput">
                  <label>Ward</label>
                  <select
                    id="ward"
                    onChange={handleChooseDelivery}
                    required={true}
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

                <div className="formInput">
                  <label>Address</label>
                  <input
                    id="address"
                    onChange={(e) =>
                      setDeliveryOption((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Shop Address"
                    required={true}
                    defaultValue={deliveryOption.address}
                  />
                </div>
              </div>
              {params && (
                <div>
                  <div className="formInput">
                    <label>Old City</label>
                    <input
                      id="address"
                      type="text"
                      readOnly
                      defaultValue={deliveryOption.province?.nameCity}
                    />
                  </div>

                  <div className="formInput">
                    <label>Old District</label>
                    <input
                      id="address"
                      type="text"
                      readOnly
                      defaultValue={deliveryOption.district?.nameDistrict}
                    />
                  </div>

                  <div className="formInput">
                    <label>Old Ward</label>
                    <input
                      id="address"
                      type="text"
                      readOnly
                      defaultValue={deliveryOption.ward?.nameWard}
                    />
                  </div>
                </div>
              )}
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

export default NewDelivery;
