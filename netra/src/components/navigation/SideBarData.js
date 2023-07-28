import HomeIcon from "@material-ui/icons/Home";
import Build from "@material-ui/icons/Build";
import PieChartIcon from "@material-ui/icons/PieChart";
import StorageIcon from "@material-ui/icons/Storage";

const SideBarData = [
  {
    title: "Homepage",
    icon: <HomeIcon fontSize="large" />,
    path: "/",
  },
  {
    title: "System Configuration",
    icon: <Build fontSize="large" />,
    path: "/system_config",
  },
  {
    title: "Dashboard",
    icon: <PieChartIcon fontSize="large" />,
    path: "/rDashboard",
  },
  {
    title: "Update Data",
    icon: <StorageIcon fontSize="large" />,
    path: "/view_data",
  },
];

export default SideBarData;
