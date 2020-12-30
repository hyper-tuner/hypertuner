import { useEffect } from 'react';
import { Layout, Space, Button, Input, Row, Col } from 'antd';
import {
  UserOutlined,
  CarOutlined,
  ShareAltOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';
import SideBar from './components/SideBar';
import { AppState, StatusState, UIState } from './types';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';
import BurnButton from './components/BurnButton';

const { Content, Header, Footer } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  status: state.status,
});

function App({ ui, status }: { ui: UIState, status: StatusState }) {
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
          <Row>
            <Col span={0} sm={8} />
            <Col span={0} sm={8} style={{ textAlign: 'center' }}>
              <Input placeholder="Search" className="electron-not-draggable" />
            </Col>
            <Col span={24} sm={8} style={{ textAlign: 'right' }}>
              <Space className="electron-not-draggable">
                <Button icon={<CloudUploadOutlined />} />
                <Button icon={<CloudDownloadOutlined />} />
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<UserOutlined />} />
              </Space>
            </Col>
          </Row>
        </Header>
        <Layout style={{ marginLeft: margin }}>
          <SideBar />
          <Layout className="app-content">
            <Content>
              <PerfectScrollbar>
                <Dialog name="engineConstants" burnButton={<BurnButton />} />
              </PerfectScrollbar>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Layout>
        <Footer className="app-status-bar">
          <Row>
            <Col span={12}>
              <Space>
                <CarOutlined />
                default
              </Space>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              {status.text}
            </Col>
          </Row>
        </Footer>
      </Layout>
    </>
  );
}

export default connect(mapStateToProps)(App);
