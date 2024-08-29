import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import CDashboard from "./pages/CDashboard/CDashboard";
import Help from "./pages/Help/Help";
import Home from "./pages/Home/Home";
import MaintenanceAllocation from "./pages/Maintenance Allocation/MaintenanceAllocation";
import PM from "./pages/PM OPTIM/pm";
import RulLife from './pages/RUL/RulLife';
import SysConfig from "./pages/SysConfig/SysConfig";
import Administrator from "./pages/Data Administrator/Administrator";
import DataManagerView from "./pages/DataManager/DataManagerView";
import MainHistoryView from "./pages/Historical Data/MainHistoryView";
import MainRel from "./pages/Reliability Dashboard/MainRel";
import ForgotPass from "./pages/Settings/ForgotPassword/Forgot_Password";
import SignIn from "./pages/Settings/SignIn";
import SignUp from "./pages/Settings/SignUp";
import ConfigureHistory from "./pages/Settings/configureHistory";
import ConfigureHistory2 from "./pages/Settings/configureHistory2";
import UserApproval from "./pages/Settings/userApproval";
import SysDocs from "./pages/System Docs/SysDocs";
import TaskDashboard from "./pages/TaskDashboard/TaskDashboard";
import ViewData from "./pages/ViewData/ViewData";
import DragNDrop from "./pages/dragNdrop/DragNdrop";
import { setLevel } from "./store/Levels";
import UserSelectionConfiguration from "./pages/userSelectionConfig/UserSelectionConfiguration";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#53538d",
      main: "#292971",
      dark: "#1c1c4f",
    },
    secondary: {
      light: "#36a4eb",
      main: "#048ee7",
      dark: "#0263a1",
    },
  },
});

function App() {
  const [settings, setSettings] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') { // 'Escape' is the standard key value
      console.log('Escape key pressed');
      // Add your code here to handle the Escape key press
    }
  });
  
  console.log("login", loggedIn)
  useEffect(() => {
    if (localStorage.getItem("settings")) {
      let settings = JSON.parse(localStorage.getItem("settings"));
      console.log(settings);
      setSettings(settings);
    }
    const storedLoginStatus = localStorage.getItem('login');
    if (storedLoginStatus === 'true') {
      setLoggedIn(true);
    }
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      dispatch(setLevel(storedUserData));
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        {NetraRoutes()}
      </div>
    </ThemeProvider>
  );

  function NetraRoutes() {
    return <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <Home
              {...props}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              settings={settings} />
          )} />
        <Route
          path="/configure_history"
          exact
          component={ConfigureHistory} />
        <Route
          path="/configure_history2"
          exact
          component={ConfigureHistory2} />
        <Route path="/user_approval" exact component={UserApproval} />
        <Route path="/forgot_password" exact component={ForgotPass} />
        <Route path="/know_netra" exact component={Help} />
        <Route
          path="/view_data"
          exact
          render={(props) => (
            <ViewData
              {...props}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              settings={settings} />
          )} />
        <Route
          path="/maintenance_allocation"
          render={(props) => (
            <MaintenanceAllocation
              {...props}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              settings={settings} />
          )} />
        <Route
          path="/sign_in"
          exact
          render={(props) => (
            <SignIn
              {...props}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              settings={settings} />
          )} />
        <Route path="/sign_up" exact component={SignUp} />
        <Route
          path="/system_config"
          render={(props) => (
            <SysConfig {...props} settings={settings} />
          )} />
        <Route
          path="/data_manager"
          render={(props) => <DataManagerView {...props} settings={settings} />} />
        <Route
          path="/historical_data"
          render={(props) => <MainHistoryView {...props} settings={settings} />} />
        <Route
          path="/add_system_doc"
          render={(props) => <SysDocs {...props} settings={settings} />} />
        <Route
          path="/user_selection_config"
          render={(props) => <UserSelectionConfiguration {...props} settings={settings} />} />

        <Route
          path="/rDashboard"
          render={(props) => (
            <MainRel {...props} settings={settings} />
          )} />

        <Route
          path="/CDashboard"
          render={(props) => <CDashboard {...props} settings={settings} />} />

        <Route
          path="/TaskDashboard"
          render={(props) => (
            <TaskDashboard {...props} settings={settings} />
          )} />
        <Route
          path="/dnd"
          render={(props) => <DragNDrop {...props} settings={settings} />} />
        <Route
          path="/optimize"
          render={() => <PM />} />
        <Route
          path="/rul"
          render={() => <RulLife />} />
        <Route
          path="/administrator"
          render={() => <Administrator />} />
      </Switch>
    </Router>;
  }
}

export default App;
