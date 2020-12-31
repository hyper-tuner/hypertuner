import { Layout, Menu, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState } from '../types/state';
import { Config, Menu as MenuType, SubMenu as SubMenuType } from '../types/config';
import Icon from './SideBar/Icon';
import { camelToUrlCase } from '../lib/utils';

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

  const { pathname } = useLocation();

  if (!config || !config.signature) {
    return (
      <Sider {...siderProps} className="app-sidebar" >
        <div style={{ paddingLeft: 10 }}>
          <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
        </div>
      </Sider>
    );
  }

  const buildLinkUrl = (main: string, sub: string) => camelToUrlCase(`/${main}/${sub}`);

  const menusList = (menus: MenuType[]) => (
    menus.map((menu: MenuType) => (
      <SubMenu
        key={`/${menu.name}`}
        icon={<Icon name={menu.name} />}
        title={menu.title}
      >
        {menu.subMenus.map((subMenu: SubMenuType) => (
          <Menu.Item
            key={buildLinkUrl(menu.name, subMenu.name)}
            icon={<Icon name={subMenu.name} />}
          >
            <Link to={buildLinkUrl(menu.name, subMenu.name)}>
              {subMenu.title}
            </Link>
          </Menu.Item>
        ))}
      </SubMenu>
    ))
  );

  return (
    <Sider {...siderProps} className="app-sidebar">
      <PerfectScrollbar>
        <Menu
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[
            `/${pathname.substr(1).split('/')[0]}`
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
