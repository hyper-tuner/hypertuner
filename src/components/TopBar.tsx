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
} from '@ant-design/icons';
import { isMac } from '../lib/env';

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

  return (
    <Header className="app-top-bar">
      <Row>
        <Col span={0} sm={8} />
        <Col span={0} sm={8} style={{ textAlign: 'center' }}>
          <Tooltip title={isMac() ? '⌘+SHIFT+P' : 'CTRL+SHIFT+P'}>
            <Input placeholder="Search anything" className="electron-not-draggable" />
          </Tooltip>
        </Col>
        <Col span={24} sm={8} style={{ textAlign: 'right' }}>
          <Space className="electron-not-draggable">
            <Button icon={<CloudUploadOutlined />}>
              {lg && 'Upload'}
            </Button>
            <Button icon={<CloudDownloadOutlined />}>
              {xl && 'Download'}
            </Button>
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
