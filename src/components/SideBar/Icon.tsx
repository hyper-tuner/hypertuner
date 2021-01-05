import {
  ApartmentOutlined,
  ApiOutlined,
  CarOutlined,
  ControlOutlined,
  DashboardOutlined,
  DotChartOutlined,
  ExperimentOutlined,
  FieldTimeOutlined,
  FireOutlined,
  FundOutlined,
  FundProjectionScreenOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  SettingOutlined,
  TableOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  UnorderedListOutlined,
  UpCircleOutlined,
} from '@ant-design/icons';

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    // main menu
    case 'settings':
      return <ControlOutlined />;
    case 'tuning':
      return <CarOutlined />;
    case 'spark':
      return <FireOutlined />;
    case 'startupIdle':
      return <PoweroffOutlined />;
    case 'accessories':
      return <ApiOutlined />;
    case 'tools':
      return <ToolOutlined />;
    case '3dTuningMaps':
      return <DotChartOutlined />;
    case 'hardwareTesting':
      return <ExperimentOutlined />;
    case 'help':
      return <QuestionCircleOutlined />;

    // common, 2D table
    case 'injChars':
    case 'airdensity_curve':
    case 'baroFuel_curve':
    case 'dwellCompensation':
    case 'iatRetard':
    case 'clt_advance_curve':
    case 'rotary_ignition':
    case 'accelEnrichments':
    case 'flexFueling':
    case 'dwell_correction_curve':
    case 'iat_retard_curve':
    case 'crankPW':
    case 'primePW':
    case 'warmup':
    case 'ASE':
    case 'iacClosedLoop_curve':
    case 'iacPwm_curve':
    case 'iacPwmCrank_curve':
    case 'iacStep_curve':
    case 'iacStepCrank_curve':
    case 'idleAdvanceSettings':
      return <FundOutlined />;

    // common 3D table / map
    case 'sparkTbl':
    case 'veTableDialog':
    case 'afrTable1Tbl':
    case 'fuelTable2Dialog':
    case 'sparkTable2Dialog':
    case 'inj_trimad':
    case 'stagingTableDialog':
    case 'stagedInjection':
    case 'fuelTemp_curve':
    case 'boostLoad':
      return <TableOutlined />;

    // rest
    case 'triggerSettings':
      return <SettingOutlined />;
    case 'reset_control':
      return <PoweroffOutlined />;
    case 'engine_constants':
      return <ControlOutlined />;
    case 'io_summary':
      return <UnorderedListOutlined />;
    case 'prgm_out_config':
      return <ApartmentOutlined />;
    case 'std_realtime':
      return <FundProjectionScreenOutlined />;
    case 'sparkSettings':
      return <FireOutlined />;
    case 'dwellSettings':
      return <FieldTimeOutlined />;
    case 'RevLimiterS':
      return <SafetyOutlined />;
    case 'idleUpSettings':
      return <UpCircleOutlined />;
    case 'LaunchControl':
      return <ThunderboltOutlined />;
    case 'NitrousControl':
      return <RocketOutlined />;
    case 'vssSettings':
      return <SettingOutlined />;

    // default / not found
    default:
      // return null;
      // return <BarsOutlined />;
      // return <SettingOutlined />;
      // return <MenuOutlined />;
      return <ControlOutlined />;
  }
};

export default Icon;
