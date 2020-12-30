import { Layout, Menu, Skeleton } from 'antd';
import {
  ApartmentOutlined,
  CarOutlined,
  ControlOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  FireOutlined,
  FundOutlined,
  FundProjectionScreenOutlined,
  SettingOutlined,
  TableOutlined,
  ToolOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from '../store';
import { AppState } from '../types/state';
import { Config, Menu as MenuType, SubMenu as SubMenuType } from '../types/config';

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

  const chooseTuneIcon = (name: string) => {
    switch (name) {
      // main menu
      case 'settings':
        return <ToolOutlined />;
      case 'tuning':
        return <CarOutlined />;
      case 'spark':
        return <FireOutlined />;

      // common, 2D table
      case 'injectorCharacteristics':
      case 'airDensity':
      case 'barometricCorrection':
      case 'dwellCompensation':
      case 'iatRetard':
      case 'coldAdvance':
      case 'rotaryIgnition':
      case 'accelerationEnrichment':
      case 'flexFuel':
        return <FundOutlined />;

      // common 3D table / map
      case 'sparkTable':
      case 'veTable':
      case 'afrTable':
      case 'secondFuelTable':
      case 'secondSparkTable':
      case 'sequentialFuelTrim':
      case 'stagedInjection':
      case 'fuelTempCorrection':
        return <TableOutlined />;

      case 'engineConstants':
        return <ControlOutlined />;
      case 'gaugeLimits':
        return <DashboardOutlined />;
      case 'ioSummary':
        return <UnorderedListOutlined />;
      case 'programmableOutputs':
        return <ApartmentOutlined />;
      case 'realtimeDisplay':
        return <FundProjectionScreenOutlined />;
      case 'sparkSettings':
        return <FireOutlined />;
      case 'dwellSettings':
        return <FieldTimeOutlined />;

      // common, default
      default:
        return <SettingOutlined />;
    }
  };

  const menusList = (menus: MenuType[]) => (
    menus.map((menu: MenuType) => (
      <SubMenu
        key={`menu-${menu.name}`}
        icon={chooseTuneIcon(menu.name)}
        title={menu.title}
      >
        {menu.subMenus.map((subMenu: SubMenuType) => (
          <Menu.Item
            key={`sub-menu-${subMenu.name}`}
            icon={chooseTuneIcon(subMenu.name)}
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
