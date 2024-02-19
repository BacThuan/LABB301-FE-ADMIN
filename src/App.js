import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NewProduct from "./pages/products/NewProduct";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Layout from "./components/layout/Layout";
import {
  productColumns,
  orderColumns,
  userColumns,
  roleColumns,
  productItemColumns,
  deliveryColumns,
  discountCode,
} from "./datatablesource";
import ListOrders from "./pages/orders/ListOrders";
import ListRoles from "./pages/roles/ListRoles";
import Error from "./components/error/Error";
import Chat from "./pages/chat/Chat";
import ListBCC from "./pages/listBrand+Category+Color/ListBCC";
import ListUsers from "./pages/users/ListUsers";
import ListProducts from "./pages/products/ListProducts";
import NewProductItem from "./pages/products/NewProductItem";
import ListItem from "./pages/products/ListItem";
import Delivery from "./pages/delivery-address/Delivery";
import DiscountCode from "./pages/discount-code/DiscountCode";
import NewDelivery from "./pages/delivery-address/NewDelivery";
import Cookies from "js-cookie";
import NewRole from "./pages/roles/NewRole";
import NewUser from "./pages/users/NewUser";
import NewOrder from "./pages/orders/NewOrder";
import NewDiscountCode from "./pages/discount-code/NewDiscountCode";

function App() {
  const token = Cookies.get("token");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: token ? <Home /> : <Login />,
        },
        { path: "home", element: <Home /> },
        { path: "auth", element: <Login /> },
        {
          path: "products",
          children: [
            { index: true, element: <ListProducts columns={productColumns} /> },
            { path: "new", element: <NewProduct /> },
          ],
        },
        {
          path: "items",
          children: [
            { index: true, element: <ListItem columns={productItemColumns} /> },
            { path: "new", element: <NewProductItem /> },
          ],
        },
        {
          path: "users",
          children: [
            { index: true, element: <ListUsers columns={userColumns} /> },
            { path: "new", element: <NewUser /> },
          ],
        },
        {
          path: "orders",
          children: [
            { index: true, element: <ListOrders columns={orderColumns} /> },
            { path: "new", element: <NewOrder /> },
          ],
        },
        {
          path: "roles",
          children: [
            { index: true, element: <ListRoles columns={roleColumns} /> },
            { path: "new", element: <NewRole /> },
          ],
        },
        { path: "bcc", element: <ListBCC /> },

        {
          path: "events",
          children: [
            {
              index: true,
              element: <DiscountCode columns={discountCode} />,
            },
            { path: "new", element: <NewDiscountCode /> },
          ],
        },
        {
          path: "delivery",
          children: [
            { index: true, element: <Delivery columns={deliveryColumns} /> },
            { path: "new", element: <NewDelivery /> },
          ],
        },
        { path: "chat", element: <Chat /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
