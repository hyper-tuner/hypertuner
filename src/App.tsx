import { useEffect } from 'react';
import { Layout, Space, Row, Col } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';
import SideBar from './components/SideBar';
import { AppState, StatusState, UIState } from './types';
import BurnButton from './components/BurnButton';
import TopBar from './components/TopBar';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';

const { Content, Footer } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  status: state.status,
});

function App({ ui, status }: { ui: UIState, status: StatusState }) {
  const margin = ui.sidebarCollapsed ? 80 : 250;

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <>
      <Layout>
        <TopBar />
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
