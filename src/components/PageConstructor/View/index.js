import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import { toUpperCase } from "../../../helpers";
import * as router from "../../../helpers/router";
import actionHandler from "../../../helpers/actions";

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
  const { id } = useParams();

  const { name, fields, actions } = options || {};

  React.useEffect(() => {
    if (options && options.initial) {
      actionHandler(options.initial.type, options.initial.options, {
        params: { id },
      }).then((res) => {
        setData(res.body);
      });
    }
  }, []);

  return (
    <Descriptions title={name} bordered>
      {fields &&
        fields.map(({ name, type }) => (
          <Descriptions.Item label={toUpperCase(name)} key={name}>
            {data &&
              data[name] &&
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
