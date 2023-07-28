import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/en-in'
import styles from './rDashboard.module.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { ModeCommentTwoTone } from '@material-ui/icons';
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      console.log('click')
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };
  
    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };
  
    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };
  
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };
  
    return (
      <div style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
        
  
        <div >
          <button className={styles.calBack} onClick={goToBack}><ArrowBackIcon fontSize="inherit"/></button>
          <label >{label()}</label>
          <button className={styles.calNext} onClick={goToNext}><ArrowForwardIcon fontSize="inherit"/></button>
        </div>
      </div >
    );
  };
  
  const EventCalendar = (props) => {
    moment.locale("en-in")
    const localizer = momentLocalizer(moment)
    return (
        <Calendar
                className={styles.eventCalendar}
                localizer={localizer}
                style={{ height: "100%", width: "100%" }}
                toolbar={true}
                events={props.events}
                view="month"
                components={{
                  toolbar: CustomToolbar
                }}
                eventPropGetter={(event, start, end, isSelected) => {
                  let newStyle = {
                    position:'relative',
                    color: 'transparent',
                    borderRadius: "25px",
                    border: "none",
                    zIndex:'1',
                    opacity:0.5,
                    top:'-85%',
                    height:"100%"
                  };

                  if (event.status === "working") {
                    newStyle.backgroundColor = "#8af6ad";
                  }
                  if (event.status === "down") {
                    newStyle.backgroundColor = "#ff8788";
                  }
                  if (event.status === "maintenance") {
                    newStyle.backgroundColor = "#f3f682";
                  }

                  return {
                    className: "",
                    style: newStyle
                  };
                }}
              />
    );
  };
  export default EventCalendar