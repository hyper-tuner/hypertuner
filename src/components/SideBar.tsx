import { Layout, Menu, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState, UIState } from '../types/state';
import {
  Config as ConfigType,
  Menus as MenusType,
} from '../types/config';
import Icon from './SideBar/Icon';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  ui: state.ui,
});

const SideBar = ({ config, ui }: { config: ConfigType, ui: UIState }) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    collapsible: true,
    breakpoint: 'md',
    collapsed: ui.sidebarCollapsed,
    onCollapse: (collapsed: boolean) => store.dispatch({ type: 'ui/sidebarCollapsed', payload: collapsed }),
  } as any;

  const { pathname } = useLocation();

  if (!config || !config.constants) {
    return (
      <Sider {...siderProps} className="app-sidebar" >
        <div style={{ paddingLeft: 10 }}>
          <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
        </div>
      </Sider>
    );
  }

  const buildLinkUrl = (main: string, sub: string) => `/${main}/${sub}`;

  const menusList = (menus: MenusType) => (
    Object.keys(menus).map((menuName: string) => (
      <SubMenu
        key={`/${menuName}`}
        icon={<Icon name={menuName} />}
        title={menus[menuName].title}
      >
        {Object.keys(menus[menuName].subMenus).map((subMenuName: string) => {
          const enabled = true;

          return (<Menu.Item
            key={buildLinkUrl(menuName, subMenuName)}
            icon={<Icon name={subMenuName} />}
            disabled={!enabled}
          >
            <Link to={buildLinkUrl(menuName, subMenuName)}>
              {menus[menuName].subMenus[subMenuName].title}
            </Link>
          </Menu.Item>);
        })}
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
