import { Layout, Space, Button, Input, Row, Col, Tooltip } from 'antd';
import {
  UserOutlined,
  ShareAltOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

// const trigger = () => {
//   const triggerProps = {
//     className: 'trigger',
//     onClick: store.dispatch({ type: 'ui/sidebarCollapsed', payload: !ui.sidebarCollapsed }),
//   } as any;

//   return ui.sidebarCollapsed
//     ? <MenuUnfoldOutlined {...triggerProps} />
//     : <MenuFoldOutlined {...triggerProps} />;
// };

const TopBar = () => (
  <Header className="app-top-bar">
    <Row>
      <Col span={0} sm={8} />
      <Col span={0} sm={8} style={{ textAlign: 'center' }}>
        <Tooltip title="⌘+P">
          <Input placeholder="Search anything" className="electron-not-draggable" />
        </Tooltip>
      </Col>
      <Col span={24} sm={8} style={{ textAlign: 'right' }}>
        <Space className="electron-not-draggable">
          <Tooltip title="Upload">
            <Button icon={<CloudUploadOutlined />} />
          </Tooltip>
          <Tooltip title="Download">
            <Button icon={<CloudDownloadOutlined />} />
          </Tooltip>
          <Tooltip title="Share">
            <Button icon={<ShareAltOutlined />} />
          </Tooltip>
          <Button icon={<UserOutlined />} />
        </Space>
      </Col>
    </Row>
  </Header>
);

export default TopBar;
