import axios from "axios";

const deliveryToken = process.env.REACT_APP_FAST_DELIVERY_TOKEN;
export const getApiCities = async () => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          token: deliveryToken,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error calling API:", error);
    alert("Some thing wrong!");
  }
};

export const getApiDistricts = async (data) => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        headers: {
          token: deliveryToken,
        },
        params: {
          province_id: data.idCity,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error calling API:", error);
    alert("Some thing wrong!");
  }
};

export const getApiWard = async (district) => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      {
        headers: {
          token: deliveryToken,
        },
        params: {
          district_id: district.idDistrict,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error calling API:", error);
    alert("Some thing wrong!");
  }
};
