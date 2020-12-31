
import { Layout, Space, Row, Col } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { AppState, StatusState } from '../types/state';

const { Footer } = Layout;

const mapStateToProps = (state: AppState) => ({
  status: state.status,
});

const StatusBar = ({ status }: { status: StatusState }) => (
  <Footer className="app-status-bar">
    <Row>
      <Col span={8}>
        <Space>
          <CarOutlined />
          default
        </Space>
      </Col>
      <Col span={8} style={{ textAlign: 'center' }} />
      <Col span={8} style={{ textAlign: 'right' }}>
        {status.text}
      </Col>
    </Row>
  </Footer>
);

export default connect(mapStateToProps)(StatusBar);
