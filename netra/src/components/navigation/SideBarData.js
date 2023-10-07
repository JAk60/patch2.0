import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import BarChartIcon from '@material-ui/icons/BarChart';
import RateReviewIcon from '@material-ui/icons/RateReview';

const SideBarData = [
  {
    title: "Homepage",
    icon: <HomeIcon fontSize="large" />,
    path: "/",
  },
  {
    title: "System Configuration",
    icon: <SettingsIcon fontSize="large" />,
    path: "/system_config",
  },
  {
    title: "Dashboard",
    icon: <BarChartIcon fontSize="large" />,
    path: "/rDashboard",
  },
  {
    title: "Update Data",
    icon: <RateReviewIcon fontSize="large" />,
    path: "/view_data",
  },
];

export default SideBarData;
