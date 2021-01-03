
import { Layout, Space, Row, Col } from 'antd';
import { CarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { AppState, ConfigState, StatusState } from '../types/state';

const { Footer } = Layout;

const mapStateToProps = (state: AppState) => ({
  status: state.status,
  config: state.config,
});

const firmware = (signature: string) => (
  <Space>
    <InfoCircleOutlined />{signature}
  </Space>
);

const StatusBar = ({ status, config }: { status: StatusState, config: ConfigState }) => (
  <Footer className="app-status-bar">
    <Row>
      <Col span={8}>
        <Space>
          <CarOutlined />
          default
        </Space>
      </Col>
      <Col span={8} style={{ textAlign: 'center' }}>
        {config.megaTune && firmware(config.megaTune.signature)}
      </Col>
      <Col span={8} style={{ textAlign: 'right' }}>
        {status.text}
      </Col>
    </Row>
  </Footer>
);

export default connect(mapStateToProps)(StatusBar);
