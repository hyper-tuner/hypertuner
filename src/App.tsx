import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';
import SideBar from './components/SideBar';
import { AppState, UIState } from './types/state';
import BurnButton from './components/BurnButton';
import TopBar from './components/TopBar';
import StatusBar from './components/StatusBar';
import { isDesktop } from './lib/env';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';

const { Content } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  status: state.status,
});

const App = ({ ui }: { ui: UIState }) => {
  const margin = ui.sidebarCollapsed ? 80 : 250;

  const { pathname } = useLocation();
  const dialogName = pathname.substr(1).split('/')[1];

  // const beforeUnload = (e: BeforeUnloadEvent) => {
  //   // cancel the event
  //   e.preventDefault();
  //   // Chrome requires returnValue to be set
  //   e.returnValue = '';
  // };

  useEffect(() => {
    loadAll();
    // window.addEventListener('beforeunload', beforeUnload);

    // return () => {
    //   window.removeEventListener('beforeunload', beforeUnload);
    // };
  }, []);

  return (
    <>
      <Layout>
        <TopBar />
        <Layout style={{ marginLeft: margin }}>
          <SideBar />
          <Layout className="app-content">
            <Content>
              <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Dialog
                  name={dialogName}
                  burnButton={isDesktop && <BurnButton />}
                />
              </PerfectScrollbar>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <StatusBar />
    </>
  );
};

export default connect(mapStateToProps)(App);
