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
import {
  Tune as TuneType,
} from '../types/tune';
import Icon from './SideBar/Icon';
import { prepareConstDeclarations } from '../lib/utils';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  tune: state.tune,
  ui: state.ui,
});

const SideBar = ({ config, tune, ui }: { config: ConfigType, tune: TuneType, ui: UIState }) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    collapsible: true,
    breakpoint: 'xl',
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
          const subMenu = menus[menuName].subMenus[subMenuName];
          let enabled = true;

          if (subMenu.condition) {
            // TODO: move this outside and evaluate, return object / array
            const constDeclarations = prepareConstDeclarations(tune.constants, config.constants.pages);
            try {
              // TODO: strip eval from `command` etc
              // https://www.electronjs.org/docs/tutorial/security
              // eslint-disable-next-line no-eval
              enabled = eval(`
                'use strict';
                ${constDeclarations.join('')}
                ${subMenu.condition};
              `);
            } catch (error) {
              console.error('Menu condition evaluation failed with:', error.message);
            }
          }

          return (<Menu.Item
            key={buildLinkUrl(menuName, subMenuName)}
            icon={<Icon name={subMenuName} />}
            disabled={!enabled}
          >
            <Link to={buildLinkUrl(menuName, subMenuName)}>
              {subMenu.title}
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
          {Object.keys(tune.constants).length && menusList(config.menus)}
        </Menu>
      </PerfectScrollbar>
    </Sider>
  );
};

export default connect(mapStateToProps)(SideBar);
