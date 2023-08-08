import AccountCircleTcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import classes from "./Navigation.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import SideBarData from "./SideBarData";

const Navigation = () => {
  const [sidebar, setSidebar] = useState(true);
  const onMouseInHandler = () => {
    setSidebar(false);
  };
  const onMouseOutHandler = () => {
    setSidebar(true);
  };
  return (
    <nav
      className={classes.navigation}
      onMouseEnter={onMouseInHandler}
      onMouseLeave={onMouseOutHandler}
    >
      <ul className={classes.nav}>
        {/* <li className={classes.nav_link}>
          <Link to='/module_select'>
            <AccountCircleTcon fontSize="large" />
          </Link>
        </li> */}
        {SideBarData.map((item, index) => {
          return (
            <li key={index} className={classes.nav_link}>
              <Link to={item.path}>
                {item.icon}
                <div
                  className={
                    sidebar
                      ? `${classes.div}`
                      : `${classes.div} + ' ' + ${classes.active}`
                  }
                >
                  {item.title}
                </div>
              </Link>
            </li>
          );
        })}
        <hr className={classes.hr}></hr>
        <li className={classes.nav_link}>
          <Link to='/rDashboard'>
            <ExitToAppIcon fontSize="large" />
            <div
              className={
                sidebar
                  ? `${classes.div}`
                  : `${classes.div} + ' ' + ${classes.active}`
              }
            >
              Logout
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
