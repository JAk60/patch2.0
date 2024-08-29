import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import AddData from "./AddData/AddData";
import AssignType from "./CreateMaintenance/AssignType";
import Main from "./Main";
import ModifyandDisplayMaintenance from "./ModifyandDisplay/ModifyandDisplayMaintenance";
import CreateRCM from "./RCM/CreateRCM";
import Critical_RCM from "./RCM/critical_RCM";
import ShareMaintenance from "./ShareMaintenance/ShareMaintenance";

const MaintenanceAllocation = (props) => {
  useEffect(() => {
    if (!props.loggedIn) {
      props.history.push("/sign_in");
    }
  });
  return (
    <Switch>
      <Route exact path='/maintenance_allocation' component={Main} />
      <Route path='/maintenance_allocation/assignMaintenance' component={AssignType} />
      <Route path='/maintenance_allocation/modify' component={ModifyandDisplayMaintenance} />
      <Route path='/maintenance_allocation/display' component={ModifyandDisplayMaintenance} />
      <Route path='/maintenance_allocation/share' component={ShareMaintenance} />
      <Route exact path='/maintenance_allocation/conduct_rcm_analysis/create' component={CreateRCM} />
      <Route exact path='/maintenance_allocation/conduct_rcm_analysis/critical_comp' component={Critical_RCM} />
      <Route path='/maintenance_allocation/add_data' component={AddData} />
    </Switch>
  );
};

export default MaintenanceAllocation;

