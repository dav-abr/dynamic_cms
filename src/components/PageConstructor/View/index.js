import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import { toUpperCase } from "../../../helpers";

const FIELD_TYPES = {
  string: ({ value }) => <span>{value}</span>,
  Address: ({ value }) => (
    <span>
      {value.street} {value.city} {value.zipcode}
    </span>
  ),
};

const View = ({ options }) => {
  const [data, setData] = React.useState({});
  let { id } = useParams();

  const { name, fields, actions } = options || {};

  React.useEffect(() => {
    if (options && options.initial) {
      fetch(options.initial + `/${id}`)
        .then((res) => res.json())
        .then((res) => setData(res));
    }
  }, []);

  return (
    <Descriptions title={name} bordered>
      {fields &&
        fields.map(({ name, type }) => (
          <Descriptions.Item label={toUpperCase(name)}>
            {data[name] &&
              type &&
              FIELD_TYPES[type] &&
              FIELD_TYPES[type]({ value: data[name] })}
          </Descriptions.Item>
        ))}
    </Descriptions>
  );
};

View.propTypes = {
  options: PropTypes.object,
};

View.defaultProps = {
  options: {},
};

export default View;
