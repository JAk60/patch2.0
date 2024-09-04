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

export const LowLevelSideBarData = (pathname, User) => {
    console.log(pathname, User, User.level);
    if (User.level === "L6") {
        if (pathname === '/maintenance_allocation/add_data') {
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
            ]
        }
        else if (pathname.startsWith('/maintenance_allocation/')) {
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
        else if (pathname === '/optimize') {
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
                }
            ]
        }
        else if (pathname === '/data_manager' ||
            pathname === '/user_selection_config' ||
            pathname === '/add_system_doc' ||
            pathname === '/administrator' ||
            pathname.startsWith('/historical_data/')) {
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
            ]
        }
    }
    return [
        {
            title: "Homepage",
            icon: <HomeIcon fontSize="large" />,
            path: "/",
        },
    ];
};