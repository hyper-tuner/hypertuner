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
    <Layout>
      <SideBar />
      <Layout
        className="site-layout"
        style={{ marginLeft: margin }}
      >
        <Content style={{ height: '100vh', overflow: 'hidden' }}>
          <Header>
            {/* {trigger()} */}

            <div style={{ textAlign: 'right' }}>
              <Space>
                  <Badge count={100} offset={[-43, 8]}>
                    <Button size="large" icon={<BellOutlined />} />
                  </Badge>
                  <Button size="large" icon={<UserOutlined />} />
              </Space>
            </div>
          </Header>
          <PerfectScrollbar>
            <Dialog name="engineConstants" />
          </PerfectScrollbar>
        </Content>
      </Layout>
    </Layout>
  );
}

export default connect(mapStateToProps)(App);
