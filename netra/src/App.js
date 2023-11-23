import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Bayesian_Inputs from "./pages/Bayesian/bayesian_input";
import CDashboard from "./pages/CDashboard/CDashboard";
import DataManager from "./pages/Data Manager/DataManager";
import HEP from "./pages/HEP/HEP";
import Help from "./pages/Help/Help";
import Home from "./pages/Home/Home";
import MaintenanceAllocation from "./pages/Maintenance Allocation/MaintenanceAllocation";
import MissionProfile from "./pages/Mission Profile/MissionProfile";
import ModuleSelection from "./pages/Module Selection/ModuleSelection";
import PM from "./pages/PM OPTIM/pm";
import Phasemanager from "./pages/Phase_Manager/Phasemanager";
import RulLife from './pages/RUL/RulLife';
import ReliabilityDashboard from "./pages/Reliability Dashboard/ReliabilityDashboard";
import New from "./pages/Reliability Dashboard/new";
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
import SystemConfiguration from "./pages/systen_configuration/SystemConfiguration";
import UserSelectionConfiguration from "./pages/userSelectionConfig/UserSelectionConfiguration";
import { setLevel } from "./store/Levels";

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
  // useEffect(() => {
  //   fetchFunction();
  // }, []);
  // function fetchFunction() {
  //   fetch("/home", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setWord(data);
  //     });
  // }
  const [settings, setSettings] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const dispatch = useDispatch();
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
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => (
                <Home
                  {...props}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  settings={settings}
                />
              )}
            />
            <Route
              path="/configure_history"
              exact
              component={ConfigureHistory}
            />
            <Route
              path="/configure_history2"
              exact
              component={ConfigureHistory2}
            />
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
                  settings={settings}
                />
              )}
            />
            <Route
              path="/maintenance_allocation"
              render={(props) => (
                <MaintenanceAllocation
                  {...props}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  settings={settings}
                />
              )}
            />
            <Route
              path="/sign_in"
              exact
              render={(props) => (
                <SignIn
                  {...props}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  settings={settings}
                />
              )}
            />
            <Route path="/sign_up" exact component={SignUp} />
            <Route
              path="/module_select"
              exact
              render={(props) => (
                <ModuleSelection
                  {...props}
                  setSettings={setSettings}
                  settings={settings}
                />
              )}
            />
            <Route
              path="/system_config"
              render={(props) => (
                <SystemConfiguration {...props} settings={settings} />
              )}
            />
            <Route
              path="/phase_manager"
              render={(props) => (
                <Phasemanager {...props} settings={settings} />
              )}
            />
            <Route
              path="/HEP"
              render={(props) => <HEP {...props} settings={settings} />}
            />
            <Route
              path="/data_manager"
              render={(props) => <DataManager {...props} settings={settings} />}
            />
            <Route
              path="/mission_profile"
              render={(props) => (
                <MissionProfile {...props} settings={settings} />
              )}
            />
            <Route
              path="/user_selection_config"
              render={(props) => (
                <UserSelectionConfiguration {...props} settings={settings} />
              )}
            />
            <Route
              path="/add_system_doc"
              render={(props) => <SysDocs {...props} settings={settings} />}
            />
            <Route
              path="/health_prediction_input"
              render={(props) => (
                <Bayesian_Inputs {...props} settings={settings} />
              )}
            />

            <Route
              path="/rDashboard"
              render={(props) => (
                <ReliabilityDashboard {...props} settings={settings} />
              )}
            />

            <Route
              path="/CDashboard"
              render={(props) => <CDashboard {...props} settings={settings} />}
            />

            <Route
              path="/TaskDashboard"
              render={(props) => (
                <TaskDashboard {...props} settings={settings} />
              )}
            />
            <Route
              path="/new"
              render={(props) => <New {...props} settings={settings} />}
            />
            <Route
              path="/dnd"
              render={(props) => <DragNDrop {...props} settings={settings} />}
            />
            <Route
              path="/optimize"
              render={()=><PM />}
            />
            <Route
              path="/rul"
              render={()=><RulLife />}
            />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
