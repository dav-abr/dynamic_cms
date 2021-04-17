import React from "react";
import PropTypes from "prop-types";

const FIELDS = {
  string: ({ value = "" }) => <span>{value}</span>,
  default: ({ value = "" }) => <span>{value.toString()}</span>,
  boolean: ({ value = "" }) => <span>{value.toString()}</span>,
  website: ({ value = "" }) => <a href={value}>{value}</a>,
};

const InlineViewer = ({ value, type }) => {
  return (
    (type &&
      FIELDS[type] &&
      FIELDS[type]({
        value: value,
      })) ||
    FIELDS.default({
      value: value,
    })
  );
};

InlineViewer.propTypes = {
  value: PropTypes.any,
  type: PropTypes.string,
};

InlineViewer.defaultProps = {
  value: "",
  type: "",
};

export default InlineViewer;
