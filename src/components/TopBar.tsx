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
  Typography,
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
  GithubOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FileZipOutlined,
  SaveOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import store from '../store';
import { isMac } from '../lib/env';
import { isCommand, isEscape, isToggleSidebar } from '../utils/keyboard/shortcuts';

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { SubMenu } = Menu;

const TopBar = () => {
  const { lg, xl } = useBreakpoint();

  const userMenu = (
    <Menu>
      <Menu.Item icon={<LoginOutlined />}>
        Login
      </Menu.Item>
      <Menu.Item icon={<UserAddOutlined />}>
        Sign-up
      </Menu.Item>
      <Menu.Item icon={<GithubOutlined />}>
        <a href="https://github.com/karniv00l/speedy-tuner" target="__blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<SettingOutlined />}>
        Preferences
      </Menu.Item>
    </Menu>
  );

  const downloadMenu = (
    <Menu>
      <SubMenu title="Tune" icon={<SlidersOutlined />}>
        <Menu.Item icon={<SaveOutlined />}>
          Download
        </Menu.Item>
        <Menu.Item icon={<DesktopOutlined />}>
          Open in app
        </Menu.Item>
      </SubMenu>
      <SubMenu title="Logs" icon={<LineChartOutlined />}>
        <Menu.Item icon={<FileZipOutlined />}>
          MLG
        </Menu.Item>
        <Menu.Item icon={<FileTextOutlined />}>
          MSL
        </Menu.Item>
        <Menu.Item icon={<FileExcelOutlined />}>
          CSV
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  const searchInput = useRef<Input | null>(null);
  const handleGlobalKeyboard = (e: KeyboardEvent) => {
    if (isCommand(e)) {
      if (searchInput) {
        e.preventDefault();
        searchInput.current!.focus();
      }
    }

    if (isToggleSidebar(e)) {
      e.preventDefault();
      store.dispatch({ type: 'ui/toggleSidebar' });
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyboard);

    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  });

  return (
    <Header className="app-top-bar">
      <Row>
        <Col span={0} sm={8} />
        <Col span={0} sm={8} style={{ textAlign: 'center' }}>
          <Tooltip title={
            <>
              <Typography.Text keyboard>{isMac ? '⌘' : 'CTRL'}</Typography.Text>
              <Typography.Text keyboard>P</Typography.Text>
            </>
          }>
            <Input
              ref={searchInput}
              onKeyUp={(e) => isEscape(e) && e.currentTarget.blur()}
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
            >
              <Button icon={<CloudDownloadOutlined />}>
                {xl && 'Download'}
              </Button>
            </Dropdown>
            <Button icon={<ShareAltOutlined />}>
              {/* TODO: add mobile native share */}
              {lg && 'Share'}
            </Button>
            <Dropdown
              overlay={userMenu}
              placement="bottomCenter"
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
