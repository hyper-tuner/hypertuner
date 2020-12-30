import { useEffect } from 'react';
import { Layout, Avatar, Space, Button, Badge } from 'antd';
import {
  BellOutlined,
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightCircleFilled,
  UserOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';
import SideBar from './components/SideBar';
import { AppState, UIState } from './types';
// import store from './store';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';

const { Content, Header, Footer } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
});

function App({ ui }: { ui: UIState }) {
  const margin = ui.sidebarCollapsed ? 80 : 250;

  // const trigger = () => {
  //   const triggerProps = {
  //     className: 'trigger',
  //     onClick: store.dispatch({ type: 'ui/sidebarCollapsed', payload: !ui.sidebarCollapsed }),
  //   } as any;

  //   return ui.sidebarCollapsed
  //     ? <MenuUnfoldOutlined {...triggerProps} />
  //     : <MenuFoldOutlined {...triggerProps} />;
  // };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <>
      <Layout>
        <Header className="app-top-bar">
          <div style={{ textAlign: 'right' }}>
            <Space>
                <Badge size="small" dot>
                  <Button icon={<BellOutlined />} />
                </Badge>
                <Button icon={<UserOutlined />} />
            </Space>
          </div>
        </Header>
        <Layout style={{ marginLeft: margin }}>
          <SideBar />
          <Layout className="app-content">
            <Content>
              <PerfectScrollbar>
                <Dialog name="engineConstants" />
              </PerfectScrollbar>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Layout>
        <Footer className="app-status-bar">
          <Space>
            <CarOutlined />
            default
          </Space>
        </Footer>
      </Layout>
    </>
  );
}

export default connect(mapStateToProps)(App);
