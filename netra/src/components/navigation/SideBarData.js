// sidebarData.js
import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import BarChartIcon from '@material-ui/icons/BarChart';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TimelineIcon from '@material-ui/icons/Timeline';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import BuildIcon from '@material-ui/icons/Build';
import ShowChartIcon from '@material-ui/icons/ShowChart';
export const getSideBarData = (pathname) => {
  switch (pathname) {
    case '/':
      return [
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
      ];
    case '/admin_dashboard':
      return [
        {
          title: "Admin Dashboard",
          icon: <BarChartIcon fontSize="large" />,
          path: "/admin_dashboard",
        },
        {
          title: "Manage Users",
          icon: <SettingsIcon fontSize="large" />,
          path: "/manage_users",
        },
      ];
    case '/user_dashboard':
      return [
        {
          title: "User Dashboard",
          icon: <HomeIcon fontSize="large" />,
          path: "/user_dashboard",
        },
        {
          title: "User Settings",
          icon: <SettingsIcon fontSize="large" />,
          path: "/user_settings",
        },
      ];
      case '/data_manager':
      case '/user_selection_config':
      case '/add_system_doc':
      case '/administrator':
      return [
        {
          title: "View Data",
          icon: <ArrowBackIcon fontSize="large" />,
          path: "/view_data",
        },
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
      ];
      case '/TaskDashboard':
        return[
          {
            title: "Homepage",
            icon: <HomeIcon fontSize="large" />,
            path: "/",
          },
            {
              title: "Mission Configuration",
              icon: <AccountTreeIcon fontSize="large" />,
              path: "/dnd",
            },
            {
              title: "Reliabilty Dashboard",
              icon: <BarChartIcon fontSize="large" />,
              path: "/rdashboard",
            },
            {
              title: "System Configuration",
              icon: <SettingsIcon fontSize="large" />,
              path: "/system_config",
            },
          ];
        case '/maintenance_allocation/conduct_rcm_analysis/critical_comp':
        return [
          {
            title: "Maintenance Allocation",
            icon: <ArrowBackIcon fontSize="large" />,
            path: "/maintenance_allocation",
          },
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
        ];
     case '/rul':
      return [
        {
          title: "Homepage",
          icon: <HomeIcon fontSize="large" />,
          path: "/",
        },
        {
          title: "Condition Monitoring",
          icon: <ShowChartIcon fontSize="large" />,
          path: "/CDashboard",
        },
        {
          title: "Add Sensor Data",
          icon: <TimelineIcon fontSize="large" />,
          path: "/maintenance_allocation/add_data",
        },
        {
          title: "Create Maintenance",
          icon: <BuildIcon fontSize="large" />,
          path: "/maintenance_allocation/assignMaintenance",
        },
        {
          title: "System Configuration",
          icon: <SettingsIcon fontSize="large" />,
          path: "/system_config",
        },
      ];
      case '/CDashboard':
        return [
          {
            title: "Homepage",
            icon: <HomeIcon fontSize="large" />,
            path: "/",
          },
          {
            title: "Create Maintenance",
            icon: <BuildIcon fontSize="large" />,
            path: "/maintenance_allocation/assignMaintenance",
          },
          {
            title: "Add Sensor Data",
            icon: <TimelineIcon fontSize="large" />,
            path: "/maintenance_allocation/add_data",
          },
          {
            title: "Time To Failure / RUL",
            icon: <AddAlarmIcon fontSize="large" />,
            path: "/rul",
          },
          {
            title: "System Configuration",
            icon: <SettingsIcon fontSize="large" />,
            path: "/system_config",
          },
        ];
        case '/optimize':
          return [
            {
              title: "Rcm Analysis",
              icon: <ArrowBackIcon fontSize="large" />,
              path: "/maintenance_allocation/conduct_rcm_analysis/critical_comp",
            },
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
          ]
      default:
      if (pathname.startsWith('/maintenance_allocation/assignMaintenance')) {
        return [
          {
            title: "Maintenance Allocation",
            icon: <ArrowBackIcon fontSize="large" />,
            path: "/maintenance_allocation",
          },
          {
            title: "Add Sensor Data",
            icon: <TimelineIcon fontSize="large" />,
            path: "/maintenance_allocation/add_data",
          },
          {
            title: "Time To Failure / RUL",
            icon: <AddAlarmIcon fontSize="large" />,
            path: "/rul",
          },
          {
            title: "Condition Monitoring",
            icon: <ShowChartIcon fontSize="large" />,
            path: "/CDashboard",
          },
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
        ];
      }
      if (pathname.startsWith('/historical_data/')) {
        return [
          {
            title: "View OR Update Data",
            icon: <ArrowBackIcon fontSize="large" />,
            path: "/view_data",
          },
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
        ];
      }
      if (pathname === '/maintenance_allocation/add_data'){
        return [
          {
            title: "View OR Update Data",
            icon: <ArrowBackIcon fontSize="large" />,
            path: "/view_data",
          },
          {
            title: "Create Maintenance",
            icon: <BuildIcon fontSize="large" />,
            path: "/maintenance_allocation/assignMaintenance",
          },
          {
            title: "Time To Failure / RUL",
            icon: <AddAlarmIcon fontSize="large" />,
            path: "/rul",
          },
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
        ];
      }
      return [
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
  }
};
