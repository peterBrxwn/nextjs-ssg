import { useState, useEffect } from "react";
import Router from "next/router";
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardFooter from "/components/Card/CardFooter.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import Link from 'next/link';

import { auth } from "../firebaseConfig";

import styles from "/styles/jss/nextjs-material-kit/pages/loginPage.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth'

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [emailForm, setEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const signUp = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user)
        if (email === 'admin@mora.com') {
          Router.push('/admin');
        } else {
          Router.push('/user');
        }
      })
      .catch(err => {
        alert('Invalid login details')
      })
  }

  // const signUpWithGoogle = () => {
  //   signInWithPopup(auth, googleProvider)
  //     .then((response) => {
  //       sessionStorage.setItem('Token', response.user.accessToken)
  //       console.log(response.user)
  //       router.push('/home')
  //     })
  // }

  // const signUpWithGithub = () => {
  //   signInWithPopup(auth, githubProvider)
  //     .then((response) => {
  //       sessionStorage.setItem('Token', response.user.accessToken)
  //       console.log(response.user)
  //       router.push('/home')
  //     })
  // }

  useEffect(() => {
    let token = sessionStorage.getItem('Token')

    if (token) {
      router.push('/home')
    }
  }, [])

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="Mora"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url('/img/bg7.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <Card>
                <form className={classes.form}>
                  <CardHeader color="success" className={classes.cardHeader}>
                    <h4>LOGIN</h4>
                  </CardHeader>
                  {
                    !emailForm
                      ? <CardBody>
                        <Button color="twitter" fullWidth>
                          <i className={classes.socials + " fab fa-twitter"} />
                          &nbsp;Login with Twitter
                        </Button>
                        <Button color="facebook" fullWidth>
                          <i className={classes.socials + " fab fa-facebook-square"} />
                          &nbsp;&nbsp;Login with Facebook
                        </Button>
                        <Button color="google" fullWidth>
                          <i
                            className={classes.socials + " fab fa-google-plus-g"} />
                          Login with Google
                        </Button>
                        <Button color="github" fullWidth>
                          <i className={classes.socials + " fab fa-github"} />
                          &nbsp;Login with Github
                        </Button>
                        <Button
                          fullWidth
                          onClick={() => setEmailForm(true)}
                        >
                          <i className={"fa fa-envelope"} />
                          &nbsp;&nbsp;Login with Email
                        </Button>
                        <br />
                        <br />
                      </CardBody>
                      :
                      <CardBody>
                        <CustomInput
                          labelText="Email..."
                          id="email"
                          formControlProps={{
                            fullWidth: true,
                            onChange: (e) => setEmail(e.target.value)
                          }}
                          inputProps={{
                            type: "email",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Email className={classes.inputIconsColor} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <CustomInput
                          labelText="Password"
                          id="password"
                          formControlProps={{
                            fullWidth: true,
                            onChange: (e) => setPassword(e.target.value)
                          }}
                          inputProps={{
                            type: "password",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  lock_outline
                                </Icon>
                              </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                        />
                        <Button
                          fullWidth
                          onClick={signUp}
                          color="success"
                        >
                          LOGIN&nbsp;&nbsp;
                          <i className={"fa fa-sign-in-alt"} />
                        </Button>
                      </CardBody>
                  }
                  {
                    emailForm
                      ? <CardFooter className={classes.cardFooter}>
                        <br />
                        <br />
                        <Button
                          simple
                          color="transparent"
                          size="lg"
                          onClick={() => setEmailForm(false)}
                        >
                          Back
                        </Button>
                      </CardFooter> : null
                  }
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
