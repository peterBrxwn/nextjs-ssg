import { useState, useEffect, forwardRef } from "react";
// react plugin for creating date-time-picker
import Datetime from "react-datetime";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// @material-ui/icons
import List from "@material-ui/icons/List";
import Add from "@material-ui/icons/Add";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// core components
import Header from "/components/Header/Header.js";
import Footer from "/components/Footer/Footer.js";
import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import CustomTabs from "/components/CustomTabs/CustomTabs.js";

import styles from "/styles/jss/nextjs-material-kit/pages/profilePage.js";
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, doc, arrayRemove, updateDoc } from 'firebase/firestore';
import moment from "moment";

const useStyles = makeStyles(styles);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

const eventCol = collection(db, 'events');
const usersCol = collection(db, 'users');
export default function ProfilePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [startDate, setStartDate] = useState(moment());
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [docName, setDocName] = useState('');
  const [durationHrs, setDurationHrs] = useState(0);
  const [durationMins, setDurationMins] = useState(0);
  const [loadingEvents, setloadingEvents] = useState(true);
  const [loadingAddEvents, setloadingAddEvents] = useState(false);
  const submitEvent = (e) => {
    e.preventDefault();
    let validStartDate = startDate;
    if (validStartDate.isValid()) {
      validStartDate = validStartDate.toDate();
    }

    const startDateMoment = moment(validStartDate);
    if (!startDateMoment.isValid()) {
      alert('Invalid start date');
      return;
    }
    const validDurationHrs = parseInt(durationHrs);
    if (validDurationHrs != durationHrs) {
      alert('Duration (hrs) should be a number');
      return;
    }
    const validDurationMins = parseInt(durationMins);
    if (validDurationMins != durationMins) {
      alert('Duration (mins) should be a number');
      return;
    }
    if (title == '') {
      alert('Please add title');
      return;
    }
    if (desc == '') {
      alert('Please add description');
      return;
    }
    const endDate = startDateMoment
      .add(durationHrs, 'hours')
      .add(durationMins, 'minutes');
    setloadingAddEvents(true);
    addDoc(eventCol, {
      startDate: validStartDate,
      endDate: endDate.toDate(),
      title: title,
      desc: desc,
      docName: docName,
      durationHrs: validDurationHrs,
      durationMins: validDurationMins,
      subscribers: [],
    }).then(() => {
      setloadingAddEvents(false);
      setStartDate('');
      setTitle('');
      setDesc('');
      setDocName('');
      setDurationHrs('');
      setDurationMins('');
      e.target.reset();
      getEvents();
    })
      .catch(err => {
        setloadingAddEvents(false);
        alert('Something went wrong.');
      });
  }
  const [eventsArr, setEventsArr] = useState([]);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({ name: 'Loading...' });
  const [usersMap, setUsersMap] = useState({});
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // alert('Not logged In');
        Router.push("/");
      }
    });
    fetchAllUserData();
  }, []);
  useEffect(() => {
    if (userId != '') fetchUserData();
  }, [userId]);
  useEffect(() => {
    if (userData.email) getEvents();
  }, [userData]);
  const getEvents = () => {
    getDocs(eventCol)
      .then((data) => {
        const eventsList = data.docs.map((item) => {
          return { ...item.data(), id: item.id }
        });
        setEventsArr(eventsList);
        setloadingEvents(false);
      });
  }
  const [classicModal, setClassicModal] = useState(false);
  const fetchUserData = () => {
    const userDoc = doc(usersCol, userId)
    getDoc(userDoc).then((data) => {
      const user = data.data();
      if (user.type === 'ADMIN') {
        setUserData(user);
      } else {
        auth.signOut();
        alert('Invalid login details');
        Router.push("/");
      }
    });
  }
  const fetchAllUserData = () => {
    getDocs(usersCol).then((data) => {
      const map = {};
      data.docs.forEach((e) => map[e.id] = e.get('name'));
      setUsersMap(map);
    });
  }
  const unsubscribe = (id, eventId) => {
    updateDoc(doc(eventCol, eventId), {
      subscribers: arrayRemove(id)
    }).then(() => {
      getEvents(userId);
    });
  }

  return (
    <div>
      <Header
        color="transparent"
        brand="Mora"
        rightLinks={<HeaderLinks isLoggedIn={userId != null} />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image="/img/profile-bg.jpg" />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div className={classes.name}>
                    <h3 className={classNames(classes.title, classes.textWhite)}>Welcome {userData.name}.</h3>
                    <br />
                    <br />
                    <h4>ADMIN</h4>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <CustomTabs
                  headerColor="success"
                  tabs={[
                    {
                      tabName: "All Events",
                      tabIcon: List,
                      tabContent: (
                        <GridContainer>
                          {
                            loadingEvents
                              ? <p>Loading...</p>
                              : eventsArr.length
                                ? eventsArr.map((event, i) => {
                                  return (
                                    <GridItem xs={12} key={event.id}>
                                      <Button
                                        color="info"
                                        block
                                        onClick={() => setClassicModal(i)}
                                      >
                                        <LibraryBooks className={classes.icon} />
                                        {event.title}
                                      </Button>
                                      <Dialog
                                        classes={{
                                          root: classes.center,
                                          paper: classes.modal
                                        }}
                                        open={classicModal === i}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        onClose={() => setClassicModal(-1)}
                                        aria-labelledby="classic-modal-slide-title"
                                        aria-describedby="classic-modal-slide-description"
                                      >
                                        <DialogTitle
                                          id="classic-modal-slide-title"
                                          disableTypography
                                          className={classes.modalHeader}
                                        >
                                          <h4 className={classes.modalTitle}>{event.title}</h4>
                                        </DialogTitle>
                                        <DialogContent
                                          id="classic-modal-slide-description"
                                          className={classes.modalBody}
                                        >
                                          <p>
                                            <b>Start:</b>&nbsp;
                                            {new Date(event.startDate.toDate()).toDateString()}:&nbsp;
                                            {new Date(event.startDate.toDate()).toTimeString()}.
                                          </p>
                                          <p>
                                            <b>Duration:</b>&nbsp;
                                            {event.durationHrs} hrs,&nbsp;
                                            {event.durationMins} mins.
                                          </p>
                                          <p>
                                            <b>End Date:</b>&nbsp;
                                            {new Date(event.endDate.toDate()).toDateString()}:&nbsp;
                                            {new Date(event.endDate.toDate()).toTimeString()}.
                                          </p>
                                          <p>
                                            <b>Doctor's Name:</b> {event.docName}.
                                          </p>
                                          <p>
                                            <b>Description:</b>
                                            <br />
                                            {event.desc}
                                          </p>
                                          <p>
                                            <b>Subscribers:</b>
                                            <br />
                                            {
                                              event.subscribers.length
                                                ? event.subscribers.map((e) => {
                                                  return (
                                                    <Button
                                                      fullWidth
                                                      onClick={() => unsubscribe(e, event.id)}
                                                      color="danger"
                                                      key={e}
                                                    >
                                                      {usersMap[e]}&nbsp;&nbsp;&nbsp;&nbsp;
                                                      <i className="fa fa-times" />
                                                    </Button>
                                                  )
                                                })
                                                : <p>No subscribers</p>
                                            }
                                          </p>
                                        </DialogContent>
                                        <DialogActions className={classes.modalFooter}>
                                          <Button
                                            onClick={() => setClassicModal(-1)}
                                            color="danger"
                                            simple
                                          >
                                            Close
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </GridItem>
                                  )
                                })
                                : <div>No events added</div>}
                        </GridContainer>
                      )
                    },
                    {
                      tabName: "Create Event",
                      tabIcon: Add,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={6} md={6}>
                            <br />
                            <form onSubmit={submitEvent}>
                              <FormControl fullWidth>
                                <Datetime
                                  inputProps={{ placeholder: "Event start date" }}
                                  onChange={(e) => setStartDate(e)}
                                  value={startDate}
                                  initialValue={startDate}
                                />
                              </FormControl>
                              <CustomInput
                                labelText="Title"
                                id="float"
                                formControlProps={{
                                  fullWidth: true,
                                  onChange: (e) => setTitle(e.target.value)
                                }}
                                value={title}
                              />
                              <CustomInput
                                labelText="Description"
                                id="float"
                                formControlProps={{
                                  fullWidth: true,
                                  onChange: (e) => setDesc(e.target.value)
                                }}
                                value={desc}
                              />
                              <CustomInput
                                labelText="Host Doctor's name"
                                id="float"
                                formControlProps={{
                                  fullWidth: true,
                                  onChange: (e) => setDocName(e.target.value)
                                }}
                                value={docName}
                              />
                              <GridContainer justify="center">
                                <GridItem xs={6}>
                                  <CustomInput
                                    labelText="Duration (hrs)"
                                    id="float"
                                    formControlProps={{
                                      onChange: (e) => setDurationHrs(e.target.value)
                                    }}
                                    value={durationHrs}
                                  />
                                </GridItem>
                                <GridItem xs={6}>
                                  <CustomInput
                                    labelText="Duration (mins)"
                                    id="float"
                                    formControlProps={{
                                      onChange: (e) => setDurationMins(e.target.value)
                                    }}
                                    value={durationMins}
                                  />
                                </GridItem>
                              </GridContainer>
                              <Button
                                color="success"
                                size="lg"
                                type="submit"
                              >
                                {
                                  !loadingAddEvents
                                    ? <span>
                                      Create
                                    </span>
                                    : <i className={"fa fa-spinner fa-spin"} />
                                }
                              </Button>
                            </form>
                          </GridItem>
                        </GridContainer>
                      )
                    },
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
