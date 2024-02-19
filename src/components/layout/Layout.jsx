import { Outlet, useNavigation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

import React from "react";
const Layout = () => {
  const navigation = useNavigation();
  return (
    <>
      <main>
        {navigation.state === "loading" && <p>Loading...</p>}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
