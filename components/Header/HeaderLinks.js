/*eslint-disable*/
import { Router, useRouter } from "next/router";
import Link from "next/link";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// core components
import Button from "/components/CustomButtons/Button.js";
import { auth } from "../../firebaseConfig";

import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const { isLoggedIn } = props;
  const classes = useStyles();
  const logout = (e) => {
    auth.signOut().then((e) => {
      Router.push("/");
    })
  }
  const currentRoute = useRouter().pathname;

  return (
    <List className={classes.list}>
      {
        isLoggedIn && currentRoute !== '/'
          ? <ListItem className={classes.listItem}>
            <Tooltip
              id="logout"
              title="Logout"
              placement={"top"}
              classes={{ tooltip: classes.tooltip }}
            >
              <Button
                onClick={logout}
                color="transparent"
                className={classes.navLink}
              >
                <i className={classes.socialIcons + " fa fa-sign-out-alt"} />
              </Button>
            </Tooltip>
          </ListItem>
          : null
      }
      {
        currentRoute !== '/events'
          ? <ListItem className={classes.listItem}>
            <Link href="/events">
              <Button
                color="transparent"
                className={classes.navLink}
              >
                <i className={classes.socialIcons + " fa fa-list"}></i>
                &nbsp;&nbsp;All Events
              </Button>
            </Link>
          </ListItem>
          : null
      }
      <ListItem className={classes.listItem}>
        <Tooltip
          id="twitter-tooltip"
          title="Follow us on twitter"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            onClick={(e) => e.preventDefault()}
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="facebook-tooltip"
          title="Follow us on facebook"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            onClick={(e) => e.preventDefault()}
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow us on instagram"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            onClick={(e) => e.preventDefault()}
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}

HeaderLinks.defaultProp = {
  isLoggedIn: false
};

HeaderLinks.propTypes = {
  isLoggedIn: PropTypes.bool,
};
