// chuyen string thanh so
export const convert = (price) => {
  price =
    typeof price === "string"
      ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : price;
  return price + " VND";
};

export const formatDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  // Tạo chuỗi định dạng "dd/mm/yyyy"
  return `${day}/${month}/${year}`;
};

export const formatState = (state) => {
  let temp = String(state);

  if (temp.includes("_")) {
    var wordArray = String(temp).split("_");

    wordArray.shift();

    return wordArray.join(" ");
  }
  return state;
};

export const shortInput = (inputString, lenght) => {
  if (inputString.length > lenght) {
    return inputString.substring(0, lenght - 3) + "...";
  } else {
    return inputString;
  }
};
