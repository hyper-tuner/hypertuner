import { Layout, Menu, Skeleton, Input } from 'antd';
import {
  ToolOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState, UIState } from '../types';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  ui: state.ui,
});

const SideBar = ({ config, ui, topOffset }: { config: any, ui: UIState, topOffset: number }) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    style: {
      height: '100vh',
      position: 'fixed',
      left: 0,
      paddingTop: ui.sidebarCollapsed ? 0 : (topOffset - 2) * 2,
    },
    collapsible: true,
    breakpoint: 'lg',
    trigger: null,
    onCollapse: (collapsed: boolean) => store.dispatch({ type: 'ui/sidebarCollapsed', payload: collapsed }),
  } as any;

  const filterStyles = {
    boxShadow: 'rgb(0 0 0 / 10%) -2px 5px 7px 0px',
    position: 'fixed',
    top: topOffset,
    left: 0,
    width: sidebarWidth,
    zIndex: 1,
    border: 'none',
  } as any;

  if (!config || !config.signature) {
    return (
      <Sider {...siderProps}>
        <Skeleton />
      </Sider>
    );
  }

  // TODO: add types
  const menusList = (menus: any) => (
    menus.map((menu: any) => (
      <SubMenu
        key={`menu-${menu.name}`}
        icon={<ToolOutlined />}
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
    <Sider {...siderProps}>
      {!ui.sidebarCollapsed && (<div style={filterStyles}>
        <Input allowClear placeholder="Filter" />
      </div>)}
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
