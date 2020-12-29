import { Layout, Menu, Skeleton, Input } from 'antd';
import {
  ToolOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { AppState } from '../types';

const { Sider } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: AppState) => ({
    config: state.config,
  })

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
      <Input allowClear placeholder="search" />
      <Menu
        // theme="dark"
        defaultSelectedKeys={['menu-settings']}
        defaultOpenKeys={['menu-settings']}
        mode="inline"
      >
        {menusList(config.menus)}
      </Menu>
    </Sider>
  );
};

export default connect(mapStateToProps)(SideBar);
