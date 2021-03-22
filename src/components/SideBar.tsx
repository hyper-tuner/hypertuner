import { Layout, Menu, Skeleton } from 'antd';
import { connect } from 'react-redux';
import {
  generatePath,
  Link,
} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useCallback } from 'react';
import store from '../store';
import {
  AppState,
  UIState,
} from '../types/state';
import {
  Config as ConfigType,
  Menus as MenusType,
} from '../types/config';
import {
  Tune as TuneType,
} from '../types/tune';
import Icon from './SideBar/Icon';
import { evaluateExpression } from '../utils/tune/expression';
import { Routes } from '../routes';

const { Sider } = Layout;
const { SubMenu } = Menu;

export interface DialogMatchedPathType {
  params: {
    category: string;
    dialog: string;
  };
}

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  tune: state.tune,
  ui: state.ui,
});

const SKIP_MENUS = [
  'help',
  'hardwareTesting',
  '3dTuningMaps',
  'dataLogging',
  'tools',
];

const SKIP_SUB_MENUS = [
  'settings/gaugeLimits',
  'settings/io_summary',
  'tuning/std_realtime',
];

const SideBar = ({
  config,
  tune,
  ui,
  matchedPath,
}: {
  config: ConfigType,
  tune: TuneType,
  ui: UIState,
  matchedPath: DialogMatchedPathType,
}) => {
  const sidebarWidth = 250;
  const siderProps = {
    width: sidebarWidth,
    collapsible: true,
    breakpoint: 'xl',
    collapsed: ui.sidebarCollapsed,
    onCollapse: (collapsed: boolean) => store.dispatch({ type: 'ui/sidebarCollapsed', payload: collapsed }),
  } as any;
  const checkCondition = useCallback((condition: string) => evaluateExpression(condition, tune.constants, config), [tune.constants, config]);
  const buildLink = useCallback((main: string, sub: string) => generatePath(Routes.DIALOG, {
    category: main,
    dialog: sub,
  }), []);

  console.log({
    matchedPath,
  });

  const menusList = useCallback((menus: MenusType) => (
    Object.keys(menus).map((menuName: string) => {
      if (SKIP_MENUS.includes(menuName)) {
        return null;
      }

      return (
        <SubMenu
          key={`/${menuName}`}
          icon={<Icon name={menuName} />}
          title={menus[menuName].title}
        >
          {Object.keys(menus[menuName].subMenus).map((subMenuName: string) => {
            if (subMenuName === 'std_separator') {
              return <Menu.Divider key={buildLink(menuName, subMenuName)} />;
            }

            if (SKIP_SUB_MENUS.includes(`${menuName}/${subMenuName}`)) {
              return null;
            }

            const subMenu = menus[menuName].subMenus[subMenuName];
            let enabled = true;

            // TODO: optimize this!
            if (subMenu.condition) {
              enabled = checkCondition(subMenu.condition);
            }

            return (<Menu.Item
              key={buildLink(menuName, subMenuName)}
              icon={<Icon name={subMenuName} />}
              disabled={!enabled}
            >
              <Link to={buildLink(menuName, subMenuName)}>
                {subMenu.title}
              </Link>
            </Menu.Item>);
          })}
        </SubMenu>
      );
    })
  ), [buildLink, checkCondition]);

  if (!config || !config.constants) {
    return (
      <Sider {...siderProps} className="app-sidebar" >
        <div style={{ paddingLeft: 10 }}>
          <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
        </div>
      </Sider>
    );
  }

  return (
    <Sider {...siderProps} className="app-sidebar">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Menu
          defaultSelectedKeys={[(matchedPath as any).url]}
          defaultOpenKeys={[`/${matchedPath.params.category}`]}
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
