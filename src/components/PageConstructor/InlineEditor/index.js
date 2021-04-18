import React from "react";
import PropTypes from "prop-types";
import { Input, Select } from "antd";
import actionHandler from "../../../helpers/actions";

const FIELDS = {
  string: ({ value, options, onChange }) => (
    <Input value={value} onChange={(event) => onChange(event.target.value)} />
  ),
  select: ({ value, options, onChange }) => {
    const [values, setValues] = React.useState([]);

    React.useEffect(() => {
      if (options.initial) {
        const { initial } = options;
        actionHandler(initial.type, initial.options).then((res) => {
          setValues(res.response);
        });
      }
    }, []);

    return (
      <Select
        onSelect={onChange}
        value={value || null}
        style={{ width: "100%" }}
      >
        {values &&
          Array.isArray(values) &&
          values.map((value) => (
            <Select.Option
              value={value[options.value]}
              key={value[options.value]}
            >
              {value[options.name]}
            </Select.Option>
          ))}
      </Select>
    );
  },
};

const InlineEditor = ({ value, type, onChange, options }) => {
  return (
    type &&
    FIELDS[type] &&
    FIELDS[type]({
      value: value,
      onChange: onChange,
      options: options,
    })
  );
};

InlineEditor.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object,
};

InlineEditor.defaultProps = {
  type: "",
  onChange: () => {},
  options: {},
};

export default InlineEditor;
