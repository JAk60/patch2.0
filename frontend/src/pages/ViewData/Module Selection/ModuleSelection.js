import React,{ useEffect } from 'react'
import styles from './ModuleSelection.module.css'
import { 
    Paper,
    makeStyles,
    FormControlLabel,
    Switch,
    FormGroup, 
    Button} 
    from '@material-ui/core'

const LabelStyles = makeStyles({
    root: {
        display:'flex',
        justifyContent:'space-between',
        margin:'15px 0px 5px 0px',
        paddingRight: 10,
        paddingLeft: 10,
        minWidth:300,
        background: "#ebebeb",
        borderRadius: "5px",
        height: 40,
        boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
        '&:hover':{
            background: "#d1d1d1",
        }
    },
    label: {
        fontSize:20,
        fontWeight:'bold',
    }
  });

const ModuleSelection=(props)=>{
    const labelClasses=LabelStyles();

    const [sysConfig, setSysConfig] = React.useState(true);
    const [phaseManager, setPhaseManager] = React.useState(true);
    const [hep, setHep] = React.useState(true);
    const [dataManager, setDataManager] = React.useState(true);
    const [dashboard, setDashboard] = React.useState(true);

    const toggleSysConfig = () => {
        setSysConfig((prev) => !prev);
    };
    const togglePhaseManager = () => {
        setPhaseManager((prev) => !prev);
    };
    const toggleHep = () => {
        setHep((prev) => !prev);
    };
    const toggleDataManager = () => {
        setDataManager((prev) => !prev);
    };
    const toggleDashboard = () => {
        setDashboard((prev) => !prev);
    };

    const save=()=>{
        let settings={
            'SystemConfiguration':sysConfig,
            'PhaseManager':phaseManager,
            'HEP':hep,
            'DataManager':dataManager,
            'ReliabilityDashboard':dashboard,
        }
        localStorage.setItem('settings',JSON.stringify(settings))
        props.setSettings(settings)
        props.history.push('/')
    }

    useEffect(()=>{
        if(localStorage.getItem("settings")){
        let settings=JSON.parse(localStorage.getItem('settings'))
        setSysConfig(settings.SystemConfiguration)
        setPhaseManager(settings.PhaseManager)
        setHep(settings.HEP)
        setDataManager(settings.DataManager)
        setDashboard(settings.ReliabilityDashboard)
        }
    },[])

    return(
        <div className={styles.container}>
        <Paper className={styles.ModulePaper} elevation={5}>
            <div>
                <img src='/netra-logo.png' width={60} height={60}/>
                <div style={{textAlign:'center'}}>NETRA</div>
            </div>
            <div style={{textAlign:'center'}}>
                <h5 style={{margin:0}}>Settings</h5>
                <h6 style={{margin:0}}>Please Select the required modules</h6>
            </div>
            <FormGroup>
                <FormControlLabel
                    classes={labelClasses}
                    control={<Switch checked={sysConfig} disabled/>}
                    label="System Configuration"
                    labelPlacement="start"
                />
                <FormControlLabel
                    classes={labelClasses}
                    control={<Switch checked={phaseManager} onChange={togglePhaseManager}/>}
                    label="Phase Manager"
                    labelPlacement="start"
                />
                <FormControlLabel
                    classes={labelClasses}
                    control={<Switch checked={hep} onChange={toggleHep} />}
                    label="HEP"
                    labelPlacement="start"
                />
                <FormControlLabel
                    classes={labelClasses}
                    control={<Switch checked={dataManager} onChange={toggleDataManager} />}
                    label="Data Manager"
                    labelPlacement="start"
                />
                <FormControlLabel
                    classes={labelClasses}
                    control={<Switch checked={dashboard} disabled/>}
                    label="Reliability Dashboard"
                    labelPlacement="start"
                />
            </FormGroup>
            <Button variant='contained' color='secondary' onClick={()=>save()}>Save</Button>
        </Paper>
    </div>
    )
}

export default ModuleSelection;