import {
  ApartmentOutlined,
  CarOutlined,
  ControlOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  FireOutlined,
  FundOutlined,
  FundProjectionScreenOutlined,
  PoweroffOutlined,
  SafetyOutlined,
  SettingOutlined,
  TableOutlined,
  ToolOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const Icon = ({ name }: { name: string }) => {
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

    case 'resetControl':
      return <PoweroffOutlined />;
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
    case 'engineProtection':
      return <SafetyOutlined />;

    // common, default
    default:
      return <SettingOutlined />;
  }
};

export default Icon;
