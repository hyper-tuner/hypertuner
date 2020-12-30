import { Layout, Menu, Skeleton } from 'antd';
import {
  FireOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState } from '../types/state';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
  config: state.config,
});

const SideBar = ({ config }: { config: any }) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    collapsible: true,
    breakpoint: 'lg',
    trigger: null,
    onCollapse: (collapsed: boolean) => store.dispatch({ type: 'ui/sidebarCollapsed', payload: collapsed }),
  } as any;

  if (!config || !config.signature) {
    return (
      <Sider {...siderProps} className="app-sidebar">
        <Skeleton />
      </Sider>
    );
  }

  const icons = {
    settings: <ToolOutlined />,
    spark: <FireOutlined />,
  } as any;

  // TODO: add types
  const menusList = (menus: any) => (
    menus.map((menu: any) => (
      <SubMenu
        key={`menu-${menu.name}`}
        icon={icons[menu.name]}
        title={menu.title}
      >
        {menu.subMenus.map((subMenu: any) => (
          <Menu.Item key={`sub-menu-${subMenu.name}`}>
              {subMenu.title}
            </Menu.Item>
        ))}
      </SubMenu>
    ))
  );

  return (
    <Sider {...siderProps} className="app-sidebar">
      <PerfectScrollbar>
        <Menu
          defaultSelectedKeys={['menu-settings']}
          defaultOpenKeys={['menu-settings', 'menu-spark']}
          mode="inline"
          style={{ height: '100%' }}
        >
          {menusList(config.menus)}
        </Menu>
      </PerfectScrollbar>
    </Sider>
  );
};

export default connect(mapStateToProps)(SideBar);
