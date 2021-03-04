import React from "react";
import PropTypes from "prop-types";
const Table = React.lazy(() => import("./Table"));
const View = React.lazy(() => import("./View"));
const Edit = React.lazy(() => import("./Edit"));
const Add = React.lazy(() => import("./Add"));
// import Table from "./Table";
// import View from "./View";
// import Edit from "./Edit";
// import Add from "./Add";

const table = ({ options }) => <Table options={options} />;
const view = ({ options }) => <View options={options} />;
const edit = ({ options }) => <Edit options={options} />;
const add = ({ options }) => <Add options={options} />;

const PAGES = {
  table,
  view,
  edit,
  add,
};

const PageConstructor = ({ type, options }) => {
  return (
    <div>
      {type &&
        ((PAGES[type] && PAGES[type]({ options })) || (
          <span>Controller not found</span>
        ))}
    </div>
  );
};

PageConstructor.propTypes = {
  type: PropTypes.string,
  options: PropTypes.object,
};

PageConstructor.defaultProps = {
  type: "",
  options: {},
};

export default PageConstructor;
