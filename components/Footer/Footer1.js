/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";

import styles from "/styles/jss/nextjs-material-kit/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
          <Link href="/login">
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
              >
                Login
              </a>
            </ListItem>
          </Link>
          <Link href="/admin">
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
              >
                Admin
              </a>
            </ListItem>
          </Link>
          <Link href="/user">
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
              >
                User
              </a>
            </ListItem>
          </Link>
          </List>
        </div>
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
