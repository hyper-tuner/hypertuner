import { useEffect } from 'react';
import { Layout,  } from 'antd';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';
import SideBar from './components/SideBar';
import { AppState, UIState } from './types';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';

const { Content } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
});

function App({ ui }: { ui: UIState }) {
  const margin = ui.sidebarCollapsed ? 80 : 250;

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
          <PerfectScrollbar>
            <Dialog name="engineConstants" />
          </PerfectScrollbar>
        </Content>
      </Layout>
    </Layout>
  );
}

export default connect(mapStateToProps)(App);
