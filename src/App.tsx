import { useEffect } from 'react';
import { Layout, Avatar, Space, Button, Badge } from 'antd';
import {
  BellOutlined,
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightCircleFilled,
  UserOutlined,
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

const { Content, Header } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
});

function App({ ui }: { ui: UIState }) {
  const margin = ui.sidebarCollapsed ? 80 : 250;
  const appBarHeight = 38;

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
        <Header className="app-bar">
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
          <SideBar topOffset={appBarHeight} />
          <Layout>
            <Content style={{ marginTop: appBarHeight, overflow: 'hidden' }}>
              <PerfectScrollbar>
                <Dialog name="engineConstants" />
              </PerfectScrollbar>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}

export default connect(mapStateToProps)(App);
