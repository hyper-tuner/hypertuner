import { Button, Grid } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const BurnButton = () => {
  const { md } = useBreakpoint();

  return (
    <Button
      type="primary"
      size="large"
      danger
      htmlType="submit"
      icon={<FireOutlined />}
      style={{ position: 'fixed', right: 35, bottom: 45 }}
    >
      {md && 'Burn'}
    </Button>
  );
};

export default BurnButton;
