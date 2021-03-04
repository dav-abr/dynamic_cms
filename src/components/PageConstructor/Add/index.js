import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { toUpperCase } from "../../../helpers";
import "./styles.css";
import InlineEditor from "../InlineEditor";
import actionHandler from "../../../helpers/actions";

const Add = ({ options }) => {
  const [data, setData] = React.useState({});

  const { fields, actions } = options || {};

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
          fields.map(({ name, type, options }) => (
            <div className="form-input" key={name}>
              <label>{toUpperCase(name)}</label>
              <InlineEditor
                value={data[name]}
                type={type}
                onChange={(value) => onChange(name, value)}
                options={options}
              />
            </div>
          ))}
      </div>
      <div className="buttons">
        {actions &&
          actions.map((action) => (
            <Button
              key={action.name}
              onClick={() => {
                if (action.type !== "reset") {
                  actionHandler(action.type, action.options, {
                    params: { body: data },
                  });
                } else {
                  setData({});
                }
              }}
            >
              {toUpperCase(action.name)}
            </Button>
          ))}
      </div>
    </div>
  );
};

Add.propTypes = {
  options: PropTypes.object,
};

export default Add;
