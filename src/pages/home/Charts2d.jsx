import React from "react";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ReactFC from "react-fusioncharts";

import FusionCharts from "fusioncharts";

import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { api } from "../../api/api";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const color_hex = {
  1: "#FF0000",
  2: "#0000FF",
  3: "#00FF00",
  4: "#FFFF00",
  5: "#FFA500",
  6: "#800080",
  7: "#FFC0CB",
  8: "#808080",
  9: "#A52A2A",
  10: "#000000",
  11: "#00FFFF",
  12: "#D3D3D3",
};

const month = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
// Preparing the chart data
// const chartData = [
//   {
//     label: month[1],
//     value: "290",
//     color: color_hex.Red,
//   },
//   {
//     label: month[2],
//     value: "260",
//     color: color_hex.Blue,
//   },
//   {
//     label: month[3],
//     value: "180",
//     color: color_hex.Green,
//   },
//   {
//     label: month[4],
//     value: "140",
//     color: color_hex.Yellow,
//   },
//   {
//     label: month[5],
//     value: "115",
//     color: color_hex.Orange,
//   },
//   {
//     label: month[6],
//     value: "100",
//     color: color_hex.Purple,
//   },
//   {
//     label: month[7],
//     value: "200",
//     color: color_hex.Pink,
//   },
//   {
//     label: month[8],
//     value: "120",
//     color: color_hex.Gray,
//   },

//   {
//     label: month[9],
//     value: "23",
//     color: color_hex.Brown,
//   },

//   {
//     label: month[10],
//     value: "55",
//     color: color_hex.Black,
//   },

//   {
//     label: month[11],
//     value: "87",
//     color: color_hex.Cyan,
//   },

//   {
//     label: month[12],
//     value: "100",
//     color: color_hex["Light Gray"],
//   },
// ];
const Chart = (props) => {
  let type = props.type;
  let year = new Date(props.year).getFullYear();
  const { data, reFetch } = useFetch(
    api + `/read/home/charts?type=${type}&year=${year}`
  );

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (data.length > 0) {
      let temp = [];

      for (let i = 0; i < data.length; ++i) {
        temp.push({
          label: month[i + 1],
          value: data[i],
          color: color_hex[i + 1],
        });
      }

      setChartData(temp);
    }
  }, [data]);

  useEffect(() => {
    // lay doanh so ban hang theo nam
    reFetch();
  }, [year]);

  // Create a JSON object to store the chart configurations
  const chartConfigs = {
    type: "column2d", // The chart type
    width: props.width, // Width of the chart
    height: props.height, // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption:
          type === "sales"
            ? `Total sales of year ${year}`
            : `Total orders of year ${year}`,
        subCaption: type === "sales" ? "Total sales" : "Total orders",
        xAxisName: "Month",
        yAxisName: type === "sales" ? "Total sales" : "Orders",
        numberSuffix: "",
        theme: "fusion",
      },
      // Chart Data - from step 2
      data: chartData,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default Chart;
