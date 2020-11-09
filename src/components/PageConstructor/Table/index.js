import React from "react";
import PropTypes from "prop-types";
import { Button, Table as AntTable } from "antd";
import { Link } from "react-router-dom";
import "./styles.css";
import { toUpperCase } from "../../../helpers";

const FIELD_TYPES = {
  string: ({ value }) => <span>{value}</span>,
  Address: ({ value }) => <span>{value.street}</span>,
  image: ({ value }) => (
    <img
      style={{ width: "50px", height: "50px", objectFit: "contain" }}
      src={value}
    />
  ),
};

const Table = ({ options }) => {
  const [data, setData] = React.useState([]);

  const { name, fields, rowActions, tableActions } = options || {};

  React.useEffect(() => {
    if (options && options.initial) {
      fetch(options.initial)
        .then((res) => res.json())
        .then((res) => setData(res));
    }
  }, []);

  const renderField = React.useCallback((type, value) => {
    return type && FIELD_TYPES[type] && FIELD_TYPES[type]({ value });
  }, []);

  const renderRowAction = React.useCallback((name, type, options, data) => {
    if (type === "call") {
      return (
        <a
          key={name}
          onClick={() => {
            console.log(type, name);
          }}
          style={{ marginRight: "10px" }}
        >
          {name}
        </a>
      );
    } else if (type === "navigate") {
      return (
        <Link
          key={name}
          to={options && options.url + `/${data.id}`}
          style={{ marginRight: "10px" }}
        >
          {name}
        </Link>
      );
    }
  }, []);

  const renderTableAction = React.useCallback((name, type, options) => {
    if (type === "call") {
      return (
        <Button
          key={name}
          onClick={() => {
            console.log(type, name);
          }}
          style={{ marginRight: "10px" }}
        >
          {name}
        </Button>
      );
    } else if (type === "navigate") {
      return (
        <Link key={name} to={options.url} style={{ marginRight: "10px" }}>
          <Button>{name}</Button>
        </Link>
      );
    }
  }, []);

  const columns = React.useMemo(
    () =>
      fields && [
        ...fields.map(({ name, type }) => ({
          title: toUpperCase(name),
          dataIndex: name,
          key: name,
          render: (text, data) => renderField(type, data[name]),
        })),
        {
          title: "Action",
          key: "action",
          render: (text, data) =>
            rowActions &&
            rowActions.map((action) =>
              renderRowAction(action.name, action.type, action.options, data)
            ),
        },
      ],
    [fields, rowActions]
  );

  return (
    (fields && (
      <div>
        <div className="table-header">
          <span>{name}</span>
          <div className="table-buttons">
            {tableActions &&
              tableActions.map((action) =>
                renderTableAction(action.name, action.type, action.options)
              )}
          </div>
        </div>
        <AntTable
          columns={columns}
          dataSource={data.map((d) => ({ ...d, key: d.id }))}
        />
      </div>
    )) ||
    null
  );
};

Table.propTypes = {
  options: PropTypes.object,
};

Table.defaultProps = {
  options: {},
};

export default Table;
