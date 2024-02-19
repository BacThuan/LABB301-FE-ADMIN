import { createStore } from "redux";
import { tokenLimit } from "./tokenLimit";
import Cookies from "js-cookie";
import { domain } from "../api/api";

const initState = {
  listIdItems: [],
  tab: "",
};
const reducer = (state = initState, action) => {
  if (action.type === "LOGIN") {
    // save data
    Cookies.set("token", action.token, {
      domain: domain,
      expires: tokenLimit,
    });

    Cookies.set("name", action.name, {
      domain: domain,
      expires: tokenLimit,
    });

    Cookies.set("email", action.email, {
      domain: domain,
      expires: tokenLimit,
    });

    Cookies.set("isAccessAdmin", true, {
      domain: domain,
      expires: tokenLimit,
    });

    return { ...state };
  }

  if (action.type === "LOGOUT") {
    Cookies.remove("token");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("isAccessAdmin");

    return initState;
  }

  if (action.type === "ADD_ITEM") {
    const newState = { ...state };
    const listIdItems = action.listIdItems;

    let listItem = newState.listIdItems;

    // filter duplicate item
    const filter = listIdItems.filter((id) => !listItem.includes(id));

    listItem.push(...filter);

    newState.listIdItems = listItem;

    return newState;
  }

  if (action.type === "REMOVE_LISTID") {
    const newState = { ...state };

    newState.listIdItems = [];
    return newState;
  }

  if (action.type === "TAB_CHAT") {
    const newState = { ...state };

    newState.tab = action.tab;
    return newState;
  }

  if (action.type === "DELETE_CHAT") {
    const newState = { ...state };

    newState.tab = "";
    return newState;
  }
  return state;
};

const store = createStore(reducer);
export default store;
