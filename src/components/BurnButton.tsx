import { Button } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const BurnButton = ({ simple }: { simple: boolean }) => (
  <Button
    type="primary"
    size="large"
    danger
    htmlType="submit"
    icon={<FireOutlined />}
    style={{ position: 'fixed', right: 35, bottom: 45 }}
  >
    {!simple && 'Burn'}
  </Button>
);

export default BurnButton;
