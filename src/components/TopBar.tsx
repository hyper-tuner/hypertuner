import {
  matchPath,
  useLocation,
  useHistory,
} from 'react-router';
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
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import store from '../store';
import { isMac } from '../utils/env';
import {
  isCommand,
  isToggleSidebar,
} from '../utils/keyboard/shortcuts';
import { Routes } from '../routes';

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { SubMenu } = Menu;

const TopBar = () => {
  const { sm } = useBreakpoint();
  const { pathname } = useLocation();
  const history = useHistory();
  const matchedTabPath = useMemo(() => matchPath(pathname, { path: Routes.TAB }), [pathname]);

  const userMenu = (
    <Menu>
      <Menu.Item disabled icon={<LoginOutlined />}>
        Login / Sign-up
      </Menu.Item>
      <Menu.Item icon={<GithubOutlined />}>
        <a href="https://github.com/speedy-tuner/speedy-tuner-cloud" target="__blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item disabled icon={<SettingOutlined />}>
        Preferences
      </Menu.Item>
    </Menu>
  );

  const shareMenu = (
    <Menu>
      <Menu.Item disabled icon={<CloudUploadOutlined />}>
        Upload
      </Menu.Item>
      <SubMenu title="Download" icon={<CloudDownloadOutlined />}>
        <SubMenu title="Tune" icon={<SlidersOutlined />}>
          <Menu.Item icon={<SaveOutlined />}>
            <a href="/tunes/202103.msq" target="__blank" rel="noopener noreferrer">
              Download
            </a>
          </Menu.Item>
          <Menu.Item disabled icon={<DesktopOutlined />}>
            Open in app
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Logs" icon={<LineChartOutlined />}>
          <Menu.Item disabled icon={<FileZipOutlined />}>
            MLG
          </Menu.Item>
          <Menu.Item disabled icon={<FileTextOutlined />}>
            MSL
          </Menu.Item>
          <Menu.Item disabled icon={<FileExcelOutlined />}>
            CSV
          </Menu.Item>
        </SubMenu>
      </SubMenu>
      <Menu.Item disabled icon={<LinkOutlined />}>
        Create link
      </Menu.Item>
      <Menu.Item disabled icon={<GlobalOutlined />}>
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
            key={pathname}
            defaultValue={matchedTabPath?.url}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => history.push(e.target.value)}
          >
            <Radio.Button value={Routes.TUNE}>Tune</Radio.Button>
            <Radio.Button value={Routes.LOG}>Log</Radio.Button>
            <Radio.Button value={Routes.DIAGNOSE}>Diagnose</Radio.Button>
          </Radio.Group>
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
