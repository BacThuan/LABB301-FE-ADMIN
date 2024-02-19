import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Toolbar = (props) => {
  return (
    <React.Fragment>
      {props.path === "users" && (
        <div className="datatableTitle">
          <div className="datatableFindId">
            {props.path}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFindById();
              }}
            >
              <input
                type="number"
                min={1}
                placeholder="Find by id"
                required={true}
                onChange={(e) => props.actionInputId(e.target.value)}
              />
            </form>
          </div>

          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by email or phone number"
                className="find_user"
                required={true}
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("role")} className="link">
              Set Roles
            </button>

            <button onClick={() => props.action("state")} className="link">
              Set States
            </button>

            <button onClick={() => props.action("email")} className="link">
              Send Emails
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {props.path === "roles" && (
        <div className="datatableTitle">
          {props.path}
          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by role name"
                className="find_user"
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {(props.path === "products" || props.path === "items") && (
        <div className="datatableTitle">
          <div className="datatableFindId">
            {props.path}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFindById();
              }}
            >
              <input
                type="number"
                min={1}
                placeholder="Find by id"
                required={true}
                onChange={(e) => props.actionInputId(e.target.value)}
              />
            </form>
          </div>

          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by product name"
                className="find_user"
                required={true}
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {(props.path === "brands" ||
        props.path === "categories" ||
        props.path === "colors") && (
        <div className="datatableTitle">
          {props.path}
          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by name or code"
                className="find_user"
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>

            <button onClick={() => props.action("brands")} className="link">
              Brands
            </button>
            <button onClick={() => props.action("categories")} className="link">
              Categories
            </button>
            <button onClick={() => props.action("colors")} className="link">
              Colors
            </button>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {props.path === "orders" && (
        <div className="datatableTitle">
          <div className="datatableFindId">
            {props.path}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFindById();
              }}
            >
              <input
                type="number"
                min={1}
                placeholder="Find by id"
                required={true}
                onChange={(e) => props.actionInputId(e.target.value)}
              />
            </form>
          </div>
          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find email or phone"
                className="find_user"
                required={true}
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {props.path === "home" && (
        <div className="datatableTitle">
          <div className="datatableTitleTool">
            <div className="datePicker">
              <DatePicker
                selected={props.selectedYear}
                onChange={props.handleYearChange}
                showYearPicker
                dateFormat="yyyy"
              />
            </div>
            <button onClick={() => props.action("default")} className="link">
              Default
            </button>
          </div>
        </div>
      )}

      {props.path === "delivery" && (
        <div className="datatableTitle">
          {props.path}

          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by address"
                className="find_user"
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>
            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}

      {props.path === "events" && (
        <div className="datatableTitle">
          {props.path}
          <div className="datatableTitleTool">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                props.actionFormSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Find by name event"
                className="find_user"
                onChange={(e) => props.actionInput(e.target.value)}
              />
            </form>

            <button onClick={() => props.action("refetch")} className="link">
              Refetch Data
            </button>
            <button onClick={() => props.action("filter")} className="link">
              Filter
            </button>
            <button onClick={() => props.action("add")} className="link">
              Add New
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default Toolbar;
