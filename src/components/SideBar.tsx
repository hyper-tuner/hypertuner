import { Layout, Menu, Skeleton, Input } from 'antd';
import {
  ToolOutlined,
} from '@ant-design/icons';
import { AppState } from '../types';
import { connect } from 'react-redux';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => {
  return {
    config: state.config,
  }
}

const siderProps = {
  width: 250,
  style: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
  },
  collapsible: false,
  className: 'site-layout-background',
} as any;

const SideBar = ({ config }: any) => {
  if (!config || !config.signature) {
    return (
      <Sider {...siderProps}>
        <Skeleton />
      </Sider>
    );
  }

  // TODO: add types
  const menus = (menus: any) => (
    menus.map((menu: any) => (
      <SubMenu
        key={`menu-${menu.name}`}
        icon={<ToolOutlined />}
        title={menu.title}
      >
        {menu.subMenus.map((subMenu: any, index: number) => (
          <Menu.Item key={`sub-menu-${subMenu.name}`}>
              {subMenu.title}
            </Menu.Item>
        ))}
      </SubMenu>
    ))
  );

  return (
    <Sider {...siderProps}>
      <Input allowClear placeholder="search" />
      <Menu
        // theme="dark"
        defaultSelectedKeys={['menu-settings']}
        defaultOpenKeys={['menu-settings']}
        mode="inline"
      >
        {menus(config.menus)}
      </Menu>
    </Sider>
  );
};

export default connect(mapStateToProps)(SideBar);
