import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Button, Input, notification } from "antd";
import { toUpperCase } from "../../../helpers";
import actionHandler from "../../../helpers/actions";
import "./styles.css";

const FIELD_TYPES = {
  string: ({ value, onChange }) => (
    <Input value={value} onChange={(event) => onChange(event.target.value)} />
  ),
  Address: ({ value }) =>
    value ? (
      <span>
        {value.street} {value.city} {value.zipcode}
      </span>
    ) : null,
};

let initialData = {};

const Edit = ({ options }) => {
  const [data, setData] = React.useState({});
  const { id } = useParams();

  const { fields, actions } = options || {};

  React.useEffect(() => {
    if (options.initial) {
      actionHandler(options.initial.type, options.initial.options, {
        params: { id },
      }).then((res) => {
        setData(res.body);
        initialData = { ...res.body };
      });
    }
  }, []);

  const onChange = React.useCallback(
    (name, value) => {
      setData({ ...data, [name]: value });
    },
    [data]
  );

  const onSave = React.useCallback(
    (action) => {
      if (action.type !== "reset") {
        actionHandler(action.type, action.options, {
          params: { body: data, id },
        }).then(() =>
          notification.success({
            message: "Success",
            description: "Successfully edited",
          })
        );
      } else {
        setData(initialData);
      }
    },
    [data, id]
  );

  return (
    <div className="form">
      <div className="form-container">
        {fields &&
          fields.map(({ name, type }) => (
            <div className="form-input" key={name}>
              <label>{toUpperCase(name)}</label>
              {type &&
                FIELD_TYPES[type] &&
                FIELD_TYPES[type]({
                  value: data[name] || "",
                  onChange: (value) => onChange(name, value),
                })}
            </div>
          ))}
      </div>
      <div className="buttons">
        {actions &&
          actions.map((action) => (
            <Button key={action.name} onClick={() => onSave(action)}>
              {toUpperCase(action.name)}
            </Button>
          ))}
      </div>
    </div>
  );
};

Edit.propTypes = {
  options: PropTypes.object,
};

export default Edit;
