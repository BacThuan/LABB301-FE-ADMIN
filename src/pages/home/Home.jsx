import "./home.css";
import { useEffect, useState } from "react";
import Widget from "../../components/widget/Widget";
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns } from "../../datatablesource";
import useFetch from "../../hooks/useFetch";
import Sidebar from "../../components/sidebar/Sidebar";
import { api } from "../../api/api";
import Toolbar from "../../components/datatable/Toolbar";
import Chart2d from "./Charts2d";
import Media from "react-media";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0-11)
const currentYear = currentDate.getFullYear();

const Home = () => {
  // const [year, setYear] = useState(currentYear);
  // const [searching, setSearching] = useState(currentDate);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(currentDate);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };
  const { data } = useFetch(
    api + `/read/home?month=${currentMonth}&year=${currentYear}`
  );

  useEffect(() => {
    document.title = "Admin Home Page";
    if (!token) navigate("/auth");
  }, []);

  const action = (action) => {
    setSelectedYear(currentDate);
  };

  // const findYear = (date) => {
  //   setYear(searching);
  // };
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" url={api + "/read/users/count"} />
          <Widget
            type="order"
            url={
              api +
              `/read/orders/count?month=${currentMonth}&year=${currentYear}`
            }
          />
          <Widget
            type="earning"
            url={
              api +
              `/read/orders/total?month=${currentMonth}&year=${currentYear}`
            }
          />
        </div>

        <Toolbar
          path="home"
          action={action}
          // actionInput={(value) => setSearching(value)}
          // actionFormSubmit={findYear}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
        />
        <Media
          queries={{
            pc: "(min-width: 1025px)",
            largeIpad: "(max-width: 1024px) and (min-width: 769px)",
            smallIpad: "(max-width: 768px) and (min-width: 481px)",
            tablet: "(max-width: 480px)",
          }}
        >
          {(matches) => (
            <>
              {matches.pc && (
                <div className="charts">
                  <Chart2d
                    year={selectedYear}
                    type="orders"
                    width="1000"
                    height="400"
                  />
                  <Chart2d
                    year={selectedYear}
                    type="sales"
                    width="1000"
                    height="400"
                  />
                </div>
              )}
              {matches.largeIpad && (
                <div className="charts">
                  <Chart2d
                    year={selectedYear}
                    type="orders"
                    width="800"
                    height="400"
                  />
                  <Chart2d
                    year={selectedYear}
                    type="sales"
                    width="800"
                    height="400"
                  />
                </div>
              )}
              {matches.smallIpad && (
                <div className="charts">
                  <Chart2d
                    year={selectedYear}
                    type="orders"
                    width="700"
                    height="400"
                  />
                  <Chart2d
                    year={selectedYear}
                    type="sales"
                    width="700"
                    height="400"
                  />
                </div>
              )}
              {matches.tablet && (
                <div className="charts">
                  <Chart2d
                    year={selectedYear}
                    type="orders"
                    width="400"
                    height="400"
                  />
                  <Chart2d
                    year={selectedYear}
                    type="sales"
                    width="400"
                    height="400"
                  />
                </div>
              )}
            </>
          )}
        </Media>

        <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <div className="datatableHome">
            {data.length === 0 && "No data"}
            {data.length > 0 && (
              <DataGrid
                className="datagrid"
                rows={data}
                pageSize={8}
                columns={orderColumns}
                rowsPerPageOptions={[8]}
                getRowId={(row) => row._id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
