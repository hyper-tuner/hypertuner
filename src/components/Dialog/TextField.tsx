import {
  Typography,
  Alert,
} from 'antd';

const TextField = ({ title }: { title: string }) => {
  const types: { [char: string]: 'info' | 'warning' } = {
    '#': 'info',
    '!': 'warning',
  };
  const type = types[title.charAt(0)];

  return (
    <Typography.Paragraph
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      {type ? <Alert
        message={type ? title.substring(1) : title}
        type={type}
        showIcon
        style={{ width: '100%', maxWidth: 700 }}
      /> : <Typography.Text type="secondary">{title}</Typography.Text>}
    </Typography.Paragraph>
  );
};

export default TextField;
