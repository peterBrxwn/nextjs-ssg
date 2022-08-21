/*eslint-disable*/
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styles from "/styles/jss/nextjs-material-kit/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const currentRoute = useRouter().pathname;

  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        {
          currentRoute !== '/'
            ? <div className={classes.left}>
              <List className={classes.list}>
                <Link href="/">
                  <ListItem className={classes.inlineBlock}>
                    <a className={classes.block} >
                      Home
                    </a>
                  </ListItem>
                </Link>
              </List>
            </div>
            : null
        }
        {
          currentRoute !== '/events'
            ? <div className={classes.left}>
              <List className={classes.list}>
                <Link href="/events">
                  <ListItem className={classes.inlineBlock}>
                    <a className={classes.block} >
                      All Events
                    </a>
                  </ListItem>
                </Link>
              </List>
            </div>
            : null
        }
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()}, Mora.
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
