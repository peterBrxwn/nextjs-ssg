import { useState, useEffect, forwardRef } from "react";
import Router from "next/router";
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
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// core components
import Header from "/components/Header/Header.js";
import Footer from "/components/Footer/Footer.js";
import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import CustomTabs from "/components/CustomTabs/CustomTabs.js";

import styles from "/styles/jss/nextjs-material-kit/pages/profilePage.js"; import { auth, db } from '../firebaseConfig';
import { collection, getDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
  const [eventsArr, setEventsArr] = useState([]);
  const [subscribedEventsArr, setSubscribedEventsArr] = useState([]);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({ name: 'Loading...' });
  const [loadingEvents, setloadingEvents] = useState(true);
  const [loadingUnSubEvents, setloadingUnSubEvents] = useState(false);
  useEffect(async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // alert('Not logged In');
        Router.push("/");
      }
    });
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
          const data = item.data();
          const subscribe = data.subscribers.includes(userId);
          return { ...data, id: item.id, subscribe };
        });
        setEventsArr(eventsList);
        setSubscribedEventsArr(eventsList.filter((item) => {
          return item.subscribe;
        }));
        setloadingEvents(false);
      });
  }
  const toggleSub = (event, state) => {
    if (state) {
      const start1 = event.startDate.toDate();
      const end1 = event.endDate.toDate();
      for (let subEvent of subscribedEventsArr) {
        if (subEvent.id === event.id) continue;
        if (max(start1, subEvent.startDate.toDate()) < min(end1, subEvent.endDate.toDate())) {
          alert('Selected event overlaps with "' + subEvent.title + '"');
          return;
        }
      }
    }

    setloadingUnSubEvents(true);
    updateDoc(doc(eventCol, event.id), {
      subscribers: state
        ? arrayUnion(userId)
        : arrayRemove(userId)
    }).then(() => {
      setloadingUnSubEvents(false);
      getEvents();
      setClassicModal(-1);
      setSubClassicModal(-1);
    })
      .catch(err => {
        setloadingUnSubEvents(false);
        alert('Something went wrong.');
      });
  }
  const max = (date1, date2) => {
    if (date1 > date2) return date1;
    return date2;
  }
  const min = (date1, date2) => {
    if (date1 < date2) return date1;
    return date2;
  }
  const [classicModal, setClassicModal] = useState(-1);
  const [subClassicModal, setSubClassicModal] = useState(-1);
  const fetchUserData = () => {
    const userDoc = doc(usersCol, userId);
    getDoc(userDoc).then((data) => {
      const user = data.data();
      if (user.type === 'USER') {
        setUserData(user);
      } else {
        auth.signOut();
        Router.push("/");
      }
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
                    <h4>USER</h4>
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
                                          <p><b>Description:</b><br /> {event.desc}</p>
                                        </DialogContent>
                                        <DialogActions className={classes.modalFooter}>
                                          {
                                            <Button
                                              color="success"
                                              simple
                                              onClick={() => toggleSub(event, !event.subscribe)}>
                                              {
                                                loadingUnSubEvents
                                                  ? <i className={"fa fa-spinner fa-spin"} />
                                                  : !event.subscribe
                                                    ? "Subscribe"
                                                    : "Unsubscribe"
                                              }
                                            </Button>
                                          }
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
                      tabName: "Subscribed Events",
                      tabIcon: List,
                      tabContent: (
                        <GridContainer>
                          {subscribedEventsArr.length
                            ? subscribedEventsArr.map((event, i) => {
                              return (
                                <GridItem xs={12} key={event.id}>
                                  <Button
                                    color="info"
                                    block
                                    onClick={() => setSubClassicModal(i)}
                                  >
                                    <LibraryBooks className={classes.icon} />
                                    {event.title}
                                  </Button>
                                  <Dialog
                                    classes={{
                                      root: classes.center,
                                      paper: classes.modal
                                    }}
                                    open={subClassicModal === i}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={() => setSubClassicModal(-1)}
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
                                        <b>Start Date:</b>&nbsp;
                                        {new Date(event.startDate.toDate()).toDateString()}.
                                      </p>
                                      <p><b>Duration:</b> {event.duration}.</p>
                                      <p>
                                        <b>Doctor's Name:</b> {event.docName}.
                                      </p>
                                      <p><b>Description:</b><br /> {event.desc}</p>
                                    </DialogContent>
                                    <DialogActions className={classes.modalFooter}>
                                      <Button
                                        color="success"
                                        simple
                                        onClick={() => toggleSub(event, false)}>
                                        Unsubscribe
                                      </Button>
                                      <Button
                                        onClick={() => setSubClassicModal(-1)}
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
                            : <div>No subscribed events</div>}
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
