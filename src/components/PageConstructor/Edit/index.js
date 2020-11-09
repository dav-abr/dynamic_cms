import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Button, Input } from "antd";
import { toUpperCase } from "../../../helpers";
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

  const ACTION_TYPES = React.useMemo(
    () => ({
      call: ({ name, options }) => (
        <Button
          key={name}
          onClick={() => {
            if (options) {
              const { url, ...filteredOptions } = options;
              fetch(url + `/${id}`, {
                ...filteredOptions,
                body: JSON.stringify(data),
              })
                .then((res) => res.json())
                .then((res) => console.log({ res }));
            }
          }}
        >
          {toUpperCase(name)}
        </Button>
      ),
      reset: ({ name }) => (
        <Button
          key={name}
          onClick={() => {
            setData(initialData);
          }}
        >
          {toUpperCase(name)}
        </Button>
      ),
    }),
    [data]
  );

  React.useEffect(() => {
    if (options.initial) {
      fetch(options.initial + `/${id}`)
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          initialData = res;
        });
    }
  }, []);

  const onChange = React.useCallback(
    (name, value) => {
      setData({ ...data, [name]: value });
    },
    [data]
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
          Object.keys(actions).map(
            (key) =>
              ACTION_TYPES[actions[key].type] &&
              ACTION_TYPES[actions[key].type]({
                name: key,
                options: actions[key].options,
              })
          )}
      </div>
    </div>
  );
};

Edit.propTypes = {
  options: PropTypes.object,
};

export default Edit;
