import React from "react";
import PropTypes from "prop-types";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, Form, Row, Table as AntTable } from "antd";
import InlineEditor from "../InlineEditor";
import InlineViewer from "../InlineViewer";
import { toUpperCase } from "../../../helpers";
import actionHandler from "../../../helpers/actions";
import "./styles.css";

const Table = ({ options }) => {
  const [data, setData] = React.useState([]);
  const [filters, setFilters] = React.useState({});
  const [pagination, setPagination] = React.useState({
    page: 1,
    size: 10,
  });
  const history = useHistory();
  const location = useLocation();
  const formRef = React.useRef();
  const {
    name,
    fields,
    rowActions,
    tableActions,
    filters: tableFilters,
    pagination: tablePagination,
  } = options || {};

  const updateTable = React.useCallback(() => {
    if (options && options.initial) {
      const { initial } = options;
      actionHandler(initial.type, initial.options, {
        search: filters,
        pagination,
      }).then((res) => {
        setData(res);
      });
    }
  }, [options, filters, pagination]);

  React.useEffect(() => {
    const queryFilters = qs.parse(location.search, { parseNumbers: true });
    formRef.current.setFieldsValue(queryFilters);
    setFilters(queryFilters);

    updateTable();
  }, []);

  React.useEffect(() => {
    updateTable();
  }, [filters, pagination]);

  const onFilterChange = React.useCallback(
    (name, value) => {
      formRef.current.setFieldsValue({
        [name]: value,
      });
    },
    [formRef]
  );

  const onSearch = React.useCallback((values) => {
    const currentFilters = qs.stringify(values, {
      skipEmptyString: true,
      skipNull: true,
    });
    history.push({
      search: currentFilters,
    });
    setFilters(values);
  }, []);

  const onReset = React.useCallback(() => {
    formRef.current.resetFields();
    history.push({
      search: "",
    });

    setFilters({});
  }, [formRef]);

  const renderField = React.useCallback((type, value) => {
    return <InlineViewer value={value} type={type} />;
  }, []);

  const renderRowAction = React.useCallback(
    (name, type, options, data) => (
      <a
        key={name}
        onClick={() => {
          actionHandler(type, options, {
            params: { id: data.id, history },
          })?.then(updateTable);
        }}
        style={{ marginRight: "10px" }}
      >
        {name}
      </a>
    ),
    []
  );

  const renderTableAction = React.useCallback(
    (name, type, options) => (
      <Button
        key={name}
        onClick={() => {
          actionHandler(type, options, { params: { history } });
        }}
        style={{ marginRight: "10px" }}
      >
        {name}
      </Button>
    ),
    []
  );

  const columns = React.useMemo(
    () =>
      fields && [
        ...fields.map(({ name, type }) => ({
          title: toUpperCase(name),
          dataIndex: name,
          key: name,
          render: (text, data) => renderField(type, data[name]),
        })),
        (rowActions &&
          rowActions.length && {
            title: "Action",
            key: "action",
            render: (text, data) =>
              rowActions &&
              rowActions.map((action) =>
                renderRowAction(action.name, action.type, action.options, data)
              ),
          }) ||
          {},
      ],
    [fields, rowActions]
  );

  return (
    (fields && (
      <div>
        <div className="table-header">
          <div className="table-title-actions">
            <span>{name}</span>
            <div className="table-buttons">
              {tableActions &&
                tableActions.map((action) =>
                  renderTableAction(action.name, action.type, action.options)
                )}
            </div>
          </div>
          <div className="table-filters">
            {tableFilters && tableFilters.fields && (
              <Form name={name} onFinish={onSearch} ref={formRef}>
                <Row gutter={16}>
                  {tableFilters.fields.map(({ name, type, options }) => (
                    <Col span={12} key={name} className="table-filters-col">
                      <Form.Item
                        name={name}
                        label={toUpperCase(name)}
                        rules={options?.validators?.map((validator) =>
                          typeof validator === "string"
                            ? {
                                [validator]: true,
                              }
                            : validator
                        )}
                      >
                        <InlineEditor
                          type={type}
                          onChange={(value) => onFilterChange(name, value)}
                          options={options}
                        />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
                <div className="table-filters-buttons">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={onReset} htmlType="button">
                      Reset
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            )}
          </div>
        </div>
        <AntTable
          columns={columns}
          dataSource={
            data &&
            Array.isArray(data) &&
            data.map((d) => ({ ...d, key: d.id }))
          }
          pagination={
            tablePagination
              ? {
                  onChange: (page, size) => setPagination({ page, size }),
                }
              : false
          }
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
