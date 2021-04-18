import React from "react";
import { Layout as AntLayout, Menu } from "antd";
import * as AntIcons from "@ant-design/icons";
import Router from "../Router";
import { useHistory } from "react-router-dom";
import config from "../../config";
import "./styles.css";

const { Header, Content, Footer, Sider } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = React.useState(true);
  const history = useHistory();

  const onCollapse = React.useCallback((value) => {
    setCollapsed(value);
  }, []);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {config.map(
            (c) =>
              c.inMenu && (
                <Menu.Item
                  key={c.name}
                  icon={
                    (c.icon &&
                      AntIcons[c.icon] &&
                      React.createElement(AntIcons[c.icon])) || (
                      <AntIcons.PieChartOutlined />
                    )
                  }
                  onClick={() => {
                    history.push(c.url);
                  }}
                >
                  {c.name}
                </Menu.Item>
              )
          )}
        </Menu>
      </Sider>
      <AntLayout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background content-container"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Router />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Footer</Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
