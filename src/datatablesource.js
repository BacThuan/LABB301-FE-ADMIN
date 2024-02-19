import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { convert, formatDate, formatState } from "./store/convert";

export const productColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "name",
    headerName: "Name",
    width: 200,
  },

  {
    field: "gender",
    headerName: "Gender",
    width: 100,
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 150,
  },
  {
    field: "category",
    headerName: "Category",
    width: 150,
  },
  {
    field: "create",
    headerName: "Created at",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },

  {
    field: "update",
    headerName: "Updated at",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
];

export const productItemColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "product_id",
    headerName: "Product Id",
    width: 100,
  },

  {
    field: "name",
    headerName: "Product Name",
    width: 200,
  },

  {
    field: "price",
    headerName: "Price",
    width: 200,
    valueFormatter: ({ value }) => convert(String(value)),
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 150,
  },
  {
    field: "size",
    headerName: "Size",
    width: 150,
  },
  {
    field: "color",
    headerName: "Color",
    width: 150,
  },
  {
    field: "state",
    headerName: "State",
    width: 200,
    valueFormatter: ({ value }) => formatState(String(value)),
  },
  {
    field: "image",
    headerName: "Image",
    renderCell: (params) => {
      return <img src={params.row.image} />;
    },
  },
];

export const orderColumns = [
  { field: "_id", headerName: "ID Order", width: 100 },
  { field: "idUser", headerName: "ID User", width: 150 },
  {
    field: "name",
    headerName: "User Name Order",
    width: 200,
  },

  {
    field: "email",
    headerName: "User Email Order",
    width: 200,
  },
  {
    field: "phone",
    headerName: "Phone Order",
    width: 150,
  },
  {
    field: "address",
    headerName: "Address Order",
    width: 200,
  },
  {
    field: "total",
    headerName: "Total Order",
    width: 150,
    valueFormatter: ({ value }) => convert(String(value)),
  },
  {
    field: "method",
    headerName: "Method",
    width: 150,
  },

  {
    field: "orderDay",
    headerName: "Order day",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "delivery",
    headerName: "Delivery Status",
    width: 200,
    valueFormatter: ({ value }) => formatState(String(value)),
  },
  {
    field: "payment",
    headerName: "Payment Status",
    width: 200,
    valueFormatter: ({ value }) => formatState(String(value)),
  },
];
export const userColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "name",
    headerName: "Name",
    width: 220,
  },

  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
  },

  {
    field: "role",
    headerName: "Role",
    width: 100,
  },

  {
    field: "state",
    headerName: "State",
    width: 150,
    valueFormatter: ({ value }) => formatState(String(value)),
  },

  {
    field: "loginDate",
    headerName: "Nearest Login",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
];
export const roleColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "roleName",
    headerName: "Role Name",
    width: 150,
  },

  {
    field: "create",
    headerName: "Create Permission",
    width: 150,
    renderCell: (params) => {
      if (params.value === true) return <CheckBoxIcon />;
      else return <CheckBoxOutlineBlankIcon />;
    },
  },

  {
    field: "read",
    headerName: "Read Permission",
    width: 150,
    renderCell: (params) => {
      if (params.value === true) return <CheckBoxIcon />;
      else return <CheckBoxOutlineBlankIcon />;
    },
  },

  {
    field: "update",
    headerName: "Update Permission",
    width: 150,
    renderCell: (params) => {
      if (params.value === true) return <CheckBoxIcon />;
      else return <CheckBoxOutlineBlankIcon />;
    },
  },

  {
    field: "delete",
    headerName: "Delete Permission",
    width: 150,
    renderCell: (params) => {
      if (params.value === true) return <CheckBoxIcon />;
      else return <CheckBoxOutlineBlankIcon />;
    },
  },
];

export const brandAndCategoryColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "name",
    headerName: "Name",
    width: 200,
  },

  {
    field: "create",
    headerName: "Created at",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
];

export const colorColumns = [
  { field: "_id", headerName: "ID", width: 100 },

  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "code",
    headerName: "Code",
    width: 200,
    renderCell: (params) => {
      return (
        <p className="colorContent">
          {params.row.code}
          <span
            className="colorIcon"
            style={{ backgroundColor: `${params.row.code}` }}
          ></span>
        </p>
      );
    },
  },

  {
    field: "create",
    headerName: "Created at",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
];

export const deliveryColumns = [
  { field: "_id", headerName: "ID", width: 230 },

  {
    field: "city",
    headerName: "City",
    width: 150,
  },

  {
    field: "fastDeliveryCodeCity",
    headerName: "Code City",
    width: 100,
  },

  {
    field: "district",
    headerName: "District",
    width: 150,
  },

  {
    field: "fastDeliveryCodeDistrict",
    headerName: "Code District",
    width: 100,
  },
  {
    field: "ward",
    headerName: "Ward",
    width: 200,
  },
  {
    field: "fastDeliveryCodeWard",
    headerName: "Code Ward",
    width: 100,
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
  },
];

export const discountCode = [
  { field: "_id", headerName: "ID", width: 230 },

  {
    field: "event",
    headerName: "Event Name",
    width: 200,
  },

  {
    field: "orderFrom",
    headerName: "For Order From",
    width: 150,
    valueFormatter: ({ value }) => convert(String(value)),
  },

  {
    field: "percent",
    headerName: "Discount Percent",
    width: 150,
    valueFormatter: ({ value }) => value + "%",
  },

  {
    field: "numberCodes",
    headerName: "Unused Codes",
    width: 150,
  },
  {
    field: "isActive",
    headerName: "Event on Active",
    width: 150,
  },

  {
    field: "start",
    headerName: "Day Start",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },

  {
    field: "end",
    headerName: "Day End",
    width: 150,
    type: "dateTime",
    valueGetter: ({ value }) => {
      return new Date(value);
    },
    valueFormatter: ({ value }) => formatDate(value),
  },
];
