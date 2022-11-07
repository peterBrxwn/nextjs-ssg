import { useState } from "react";
import Router from "next/router";
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import Header from "/components/Header/CustomHeader.js";
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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

import styles from "/styles/jss/nextjs-material-kit/pages/loginPage.js";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const useStyles = makeStyles(styles);

const usersCol = collection(db, 'users');
export default function LoginPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [emailForm, setEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = () => {
    if (email == '') {
      alert('Please add email');
      return;
    }
    if (password == '') {
      alert('Please add password');
      return;
    }
    if (loading) return;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        fetchUserData(result.user);
      })
      .catch(err => {
        setLoading(false);
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-email':
          case 'auth/wrong-password':
            alert('Invalid login details.');
            break;
          case 'auth/network-request-failed':
            alert('Please check network connection.');
            break;
          case 'auth/user-disabled':
            alert('Please contact support.');
            break;
          default:
            alert('Something went wrong.');
        }
      });
  }
  const signInWithSocialMedia = (provider) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        fetchUserData(result.user);
      }).catch((error) => {
        alert(error.message);
      });
  }
  const fetchUserData = (user) => {
    getDoc(doc(usersCol, user.uid)).then((data) => {
      const user = data.data();
      if (!user) {
        createUser(user);
      } else {
        setLoading(false);
        if (user.type === 'ADMIN') {
          Router.push('/admin');
        } else {
          Router.push('/user');
        }
      }
    });
  }
  const createUser = (user) => {
    setDoc(doc(usersCol, user.uid), {
      name: user.name ?? 'Anon',
      type: 'ADMIN',
      email: user.email ?? '',
    }).then(() => {
      setLoading(false);
      Router.push('/admin');
    });
  }

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
                        <Button color="twitter" fullWidth
                          onClick={() => signInWithSocialMedia(twitterProvider)}
                        >
                          <i className={classes.socials + " fab fa-twitter"} />
                          &nbsp;Login with Twitter
                        </Button>
                        <Button
                          color="facebook"
                          fullWidth
                          onClick={() => signInWithSocialMedia(facebookProvider)}
                        >
                          <i className={classes.socials + " fab fa-facebook-square"} />
                          &nbsp;&nbsp;Login with Facebook
                        </Button>
                        <Button color="google" fullWidth
                          onClick={() => signInWithSocialMedia(googleProvider)}
                        >
                          <i
                            className={classes.socials + " fab fa-google-plus-g"} />
                          Login with Google
                        </Button>
                        <Button color="github" fullWidth
                          onClick={() => signInWithSocialMedia(githubProvider)}
                        >
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
                          onClick={signIn}
                          color="success"
                        >
                          {
                            !loading
                              ? <span>
                                LOGIN&nbsp;&nbsp;
                                <i className={"fa fa-sign-in-alt"} />
                              </span>
                              : <i className={"fa fa-spinner fa-spin"} />
                          }

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
