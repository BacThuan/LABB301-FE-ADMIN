import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ChatIcon from "@mui/icons-material/Chat";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiClient } from "../../api/api";
import { useState } from "react";
import Media from "react-media";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const handleClickLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth");
  };

  const sizeBar = (
    <div className="sidebar">
      <div className="sidebarTitle">
        <Link to="/">
          <span className="logo">Admin</span>
        </Link>
      </div>
      <hr />
      <div className="sidebarCenter">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/home">
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <p className="title">LISTS</p>

          <Link to="/users">
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          <Link to="/products">
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>

          <Link to="/items">
            <li>
              <TextSnippetIcon className="icon" />
              <span>Items</span>
            </li>
          </Link>

          <Link to="/orders">
            <li>
              <CreditCardIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>

          <Link to="/roles">
            <li>
              <GroupsIcon className="icon" />
              <span>Roles</span>
            </li>
          </Link>

          <Link to="/bcc">
            <li>
              <CategoryIcon className="icon" />
              <span>Brand/Category/Color</span>
            </li>
          </Link>
          <Link to="/events">
            <li>
              <QrCodeIcon className="icon" />
              <span>Events</span>
            </li>
          </Link>

          <Link to="/delivery">
            <li>
              <LocalShippingIcon className="icon" />
              <span>Delivery Address</span>
            </li>
          </Link>

          <p className="title">NEW</p>
          <Link to="/users/new">
            <li>
              <PersonOutlineIcon className="icon" />
              <span>New Users</span>
            </li>
          </Link>
          <Link to="/products/new">
            <li>
              <CreditCardIcon className="icon" />
              <span>New Products</span>
            </li>
          </Link>

          <Link to="/products?getId=true">
            <li>
              <PostAddIcon className="icon" />
              <span>New Items</span>
            </li>
          </Link>

          <Link to="/orders/new">
            <li>
              <LocalPhoneIcon className="icon" />
              <span>New Order</span>
            </li>
          </Link>

          <Link to="/roles/new">
            <li>
              <GroupsIcon className="icon" />
              <span>New Role</span>
            </li>
          </Link>

          <Link to="/events/new">
            <li>
              <QrCodeIcon className="icon" />
              <span>New Event</span>
            </li>
          </Link>

          <Link to="/delivery/new">
            <li>
              <LocalShippingIcon className="icon" />
              <span>New Delivery Address</span>
            </li>
          </Link>

          <p className="title">CHAT ROOM</p>

          <Link to="/chat">
            <li>
              <ChatIcon className="icon" />
              <span>Chat</span>
            </li>
          </Link>

          <p className="title">USER</p>
          <a href={apiClient}>
            <li>
              <HomeIcon className="icon" />
              <span>Return client page</span>
            </li>
          </a>
          <li onClick={handleClickLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const openSizeBar = () => {};
  return (
    <Media
      queries={{
        largeIpad: "(min-width: 769px)",
        smallIpad: "(max-width: 768px) and (min-width: 481px)",
        tablet: "(max-width: 480px)",
      }}
    >
      {(matches) => (
        <>
          {matches.largeIpad && <>{sizeBar}</>}
          {matches.smallIpad && (
            <div className="sidebarButton" onClick={() => setOpened(!opened)}>
              <div className="openSideBar">SizeBar</div>
              {opened && (
                <>
                  <div className="backdrop"></div>
                  {sizeBar}
                </>
              )}
            </div>
          )}
          {matches.tablet && (
            <div className="sidebarButton" onClick={() => setOpened(!opened)}>
              <div className="openSideBar">SizeBar</div>
              {opened && (
                <>
                  <div className="backdrop"></div>
                  {sizeBar}
                </>
              )}
            </div>
          )}
        </>
      )}
    </Media>
  );
};

export default Sidebar;
