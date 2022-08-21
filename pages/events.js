import { useState, forwardRef } from "react";
import { getEventsData } from '../lib/events';
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../components/Footer/Footer";
import Header from "/components/Header/Header.js";
import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import styles from "/styles/jss/nextjs-material-kit/pages/profilePage.js";
import classNames from "classnames";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles(styles);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

export async function getStaticProps() {
  const eventsData = await getEventsData();
  return { props: { eventsData } };
}

export default function Events(eventsData) {
  console.log(eventsData, eventsData.eventsData.length);
  const eventsArr = eventsData.eventsData;
  const classes = useStyles();
  const [classicModal, setClassicModal] = useState(false);

  return (
    <div>
      <Header
        color="transparent"
        brand="Mora"
        rightLinks={<HeaderLinks isLoggedIn={false} />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
      />
      <Parallax small filter image="/img/profile-bg.jpg" />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div className={classes.name}>
                    <h3 className={classNames(classes.title, classes.textWhite)}>All Events.</h3>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <GridContainer>
                  {
                    eventsArr.length
                      ? eventsArr.map((event, i) => {
                        console.log(event.startDate, event.endDate);
                        return (
                          <GridItem xs={12} key={event.id}>
                            <Button
                              color="info"
                              block
                              onClick={() => setClassicModal(i)}
                            >
                              {i + 1}&nbsp;&nbsp;&nbsp;&nbsp;
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
                                  <b>Start Date:</b>&nbsp;
                                  {new Date(event.startDate).toString()}.
                                </p>
                                <p>
                                  <b>Duration:</b>&nbsp;
                                  {event.durationHrs} hrs,&nbsp;
                                  {event.durationMins} mins.
                                </p>
                                <p>
                                  <b>End Date:</b>&nbsp;
                                  {new Date(event.endDate).toString()}.
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
                                  <b>Subscribers Count:</b>&nbsp;
                                  {event.subscribers.length}
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
                      : <div>No events available</div>}
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
