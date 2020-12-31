import { Layout, Menu, Skeleton } from 'antd';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState } from '../types/state';
import { Config, Menu as MenuType, SubMenu as SubMenuType } from '../types/config';
import Icon from './SideBar/Icon';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
  config: state.config,
});

const SideBar = ({ config }: { config: Config }) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    collapsible: true,
    breakpoint: 'md',
    trigger: null,
    onCollapse: (collapsed: boolean) => store.dispatch({ type: 'ui/sidebarCollapsed', payload: collapsed }),
  } as any;

  if (!config || !config.signature) {
    return (
      <Sider {...siderProps} className="app-sidebar" style={{ padding: 10 }}>
        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
      </Sider>
    );
  }

  const menusList = (menus: MenuType[]) => (
    menus.map((menu: MenuType) => (
      <SubMenu
        key={`menu-${menu.name}`}
        icon={<Icon name={menu.name} />}
        title={menu.title}
      >
        {menu.subMenus.map((subMenu: SubMenuType) => (
          <Menu.Item
            key={`sub-menu-${subMenu.name}`}
            icon={<Icon name={subMenu.name} />}
          >
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
          defaultOpenKeys={[
            // 'menu-settings',
            'menu-tuning',
            'menu-spark',
          ]}
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
