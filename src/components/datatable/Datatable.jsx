import "./datatable.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Toolbar from "./Toolbar";
const Datatable = (props) => {
  const [pageStage, setPageState] = useState({
    list: [],
    total: 0,
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // get data
  const { data, loading, error, reFetch } = useFetch(
    `${props.api}&page=${paginationModel.page}&limit=${paginationModel.pageSize}`
  );
  useEffect(() => {
    if (pageStage.list.length === 0 && paginationModel.page > 0) {
      setPaginationModel((prev) => ({
        ...prev,
        page: paginationModel.page - 1,
      }));
    }
  });

  // set table
  useEffect(() => {
    if (data.datas) {
      setPageState({
        list: data.datas,
        total: data.total,
      });
    }
  }, [data]);

  //get row data for brand,category,color
  useEffect(() => {
    let id = props.row;

    pageStage.list.forEach((obj) => {
      if (obj._id === id) props.getRowData(obj);
    });
  }, [props.row]);

  useEffect(() => {
    reFetch();
  }, [paginationModel, props.api, props.refetch]);

  const getRowData = (row) => {
    if (props.path === "users") {
      return row.email;
    } else return row._id;
  };

  return (
    <div className="datatable">
      <Toolbar
        path={props.path}
        action={props.action}
        actionInput={props.actionInput}
        actionFormSubmit={props.actionFormSubmit}
        actionInputId={props.actionInputId}
        actionFindById={props.actionFindById}
      />

      {pageStage.list.length === 0 && "No data"}
      {pageStage.list.length > 0 && (
        <DataGrid
          className="datagrid"
          rows={pageStage.list}
          rowCount={pageStage.total}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15, 20, pageStage.total]}
          paginationMode="server"
          columns={props.columns.concat(props.actionColumn)}
          checkboxSelection
          onRowSelectionModelChange={(data) => props.handleSelected(data)}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => getRowData(row)}
        />
      )}
    </div>
  );
};

export default Datatable;
