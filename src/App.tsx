import { useEffect } from 'react';
import { Layout,  } from 'antd';
import Dialog from './components/Dialog';
import { loadAll } from './lib/api';

import 'antd/dist/antd.css';
import './App.css';
import SideBar from './components/SideBar';

const { Content } = Layout;

function App() {
  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Layout
        className="site-layout"
        style={{ marginLeft: 250 }}
      >
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Dialog name="engineConstants" />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
