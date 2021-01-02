import {
  Layout,
  Space,
  Button,
  Input,
  Row,
  Col,
  Tooltip,
  Grid,
  Menu,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  ShareAltOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SettingOutlined,
  LoginOutlined,
  UserAddOutlined,
  LineChartOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import store from '../store';

const { Header } = Layout;
const { useBreakpoint } = Grid;

// const trigger = () => {
//   const triggerProps = {
//     className: 'trigger',
//     onClick: store.dispatch({ type: 'ui/sidebarCollapsed', payload: !ui.sidebarCollapsed }),
//   } as any;

//   return ui.sidebarCollapsed
//     ? <MenuUnfoldOutlined {...triggerProps} />
//     : <MenuFoldOutlined {...triggerProps} />;
// };


const TopBar = () => {
  const { lg, xl } = useBreakpoint();

  const userMenu = (
    <Menu>
      <Menu.Item>
        <a href="/login">
          <LoginOutlined /> Login
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="/sign-up">
          <UserAddOutlined /> Sign-up
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="/preferences">
          <SettingOutlined /> Preferences
        </a>
      </Menu.Item>
    </Menu>
  );

  const downloadMenu = (
    <Menu>
      <Menu.Item>
        <a href="/download/tune">
          <SlidersOutlined /> Tune
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="/download/logs">
          <LineChartOutlined /> Logs
        </a>
      </Menu.Item>
    </Menu>
  );

  const searchInput = useRef({} as any);
  useEffect(() => {
    document.onkeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        if (searchInput) {
          e.preventDefault();
          searchInput.current.focus();
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        store.dispatch({ type: 'ui/toggleSidebar'});
      }
    };

    return () => {
      document.onkeyup = null;
    };
  });

  return (
    <Header className="app-top-bar">
      <Row>
        <Col span={0} sm={8} />
        <Col span={0} sm={8} style={{ textAlign: 'center' }}>
          <Tooltip title="⌘ / CTRL + P">
            <Input
              ref={searchInput}
              onKeyUp={(e) => e.key === 'Escape' && e.currentTarget.blur()}
              placeholder="Search / Command"
              className="electron-not-draggable"
            />
          </Tooltip>
        </Col>
        <Col span={24} sm={8} style={{ textAlign: 'right' }}>
          <Space className="electron-not-draggable">
            <Button icon={<CloudUploadOutlined />}>
              {lg && 'Upload'}
            </Button>
            <Dropdown
              overlay={downloadMenu}
              placement="bottomCenter"
              trigger={['click']}
            >
              <Button icon={<CloudDownloadOutlined />}>
                {xl && 'Download'}
              </Button>
            </Dropdown>
            <Button icon={<ShareAltOutlined />}>
              {lg && 'Share'}
            </Button>
            <Dropdown
              overlay={userMenu}
              placement="bottomCenter"
              trigger={['click']}
            >
              <Button icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default TopBar;
