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
  Radio,
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
  GlobalOutlined,
  LinkOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import store from '../store';
import { isMac } from '../lib/env';
import {
  isCommand,
  isToggleSidebar,
} from '../utils/keyboard/shortcuts';

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { SubMenu } = Menu;

const TopBar = () => {
  const { sm } = useBreakpoint();

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

  const shareMenu = (
    <Menu>
      <Menu.Item icon={<CloudUploadOutlined />}>
        Upload
      </Menu.Item>
      <SubMenu title="Download" icon={<CloudDownloadOutlined />}>
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
      </SubMenu>
      <Menu.Item icon={<LinkOutlined />}>
        Create link
      </Menu.Item>
      <Menu.Item icon={<GlobalOutlined />}>
        Publish to Hub
      </Menu.Item>
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
        <Col span={0} md={8} sm={0} />
        <Col span={12} md={8} sm={16} style={{ textAlign: 'center' }}>
          <Radio.Group
            options={['Tune', 'Logs', 'Diagnose']}
            defaultValue="Tune"
            optionType="button"
            buttonStyle="solid"
          />
        </Col>
        <Col span={12} md={8} sm={8} style={{ textAlign: 'right' }}>
          <Space className="electron-not-draggable">
            <Tooltip title={
              <>
                <Typography.Text keyboard>{isMac ? '⌘' : 'CTRL'}</Typography.Text>
                <Typography.Text keyboard>P</Typography.Text>
              </>
            }>
              {sm && <Button icon={<SearchOutlined />} />}
            </Tooltip>
            <Dropdown
              overlay={shareMenu}
              placement="bottomCenter"
            >
              <Button icon={<ShareAltOutlined />}>
                <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown
              overlay={userMenu}
              placement="bottomCenter"
            >
              <Button icon={<UserOutlined />}>
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default TopBar;
