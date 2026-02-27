import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { resetLevels } from "../../store/Levels";
import classes from "./Navigation.module.css";
import { getSideBarData } from "./SideBarData";
import { LowLevelSideBarData } from "./LowLevelSideBarData";

const Navigation = () => {
  const location = useLocation();
  const User = localStorage.getItem("userData");
  console.log('User', User)
  const [sidebar, setSidebar] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const Logout = () => {
    localStorage.setItem("login", false);
    history.push("/sign_in");
    dispatch(resetLevels({
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      L5: false,
      L6: false,
    }));
  };

  const onMouseInHandler = () => {
    setSidebar(false);
  };
  const onMouseOutHandler = () => {
    setSidebar(true);
  };
  const SideBarData = getSideBarData(location.pathname);
  const LowLevelSideBar = LowLevelSideBarData(location.pathname,JSON.parse(User));
  console.log('LowLevelSideBar', LowLevelSideBar)
  return (
    <nav
      className={classes.navigation}
      onMouseEnter={onMouseInHandler}
      onMouseLeave={onMouseOutHandler}
    >
      {(JSON.parse(User).level === 'L0' || JSON.parse(User).level === 'L5') ?
        NavIterator(SideBarData, sidebar, Logout)
        : NavIterator(LowLevelSideBar, sidebar, Logout)}
    </nav>
  );
};

export default Navigation;
function NavIterator(SideBarData, sidebar, Logout) {
  return <ul className={classes.nav}>
    {SideBarData?.map((item, index) => {
      return (
        <li key={index} className={classes.nav_link}>
          <Link to={item.path}>
            {item.icon}
            <div
              className={sidebar
                ? `${classes.div}`
                : `${classes.div} + ' ' + ${classes.active}`}
            >
              {item.title}
            </div>
          </Link>
        </li>
      );
    })}
    <hr className={classes.hr}></hr>
    <li className={classes.nav_link}>
      <Link onClick={Logout}>
        <ExitToAppIcon fontSize="large" />
        <div
          className={sidebar
            ? `${classes.div}`
            : `${classes.div} + ' ' + ${classes.active}`}
        >
          Logout
        </div>
      </Link>
    </li>
  </ul>;
}

