import React, { useState } from "react";
import {
  Hidden,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Grid,
  Avatar,
} from "@material-ui/core";
import { FaUserCheck } from "react-icons/fa";
import { makeStyles } from "@material-ui/styles";
import Visualization from './../../svg/visualization.svg'
// import {ForceGraph3D} from 'react-force-graph';
import { Link as RRDLink, useNavigate } from "react-router-dom";
import { useSnackbar } from 'react-simple-snackbar'
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    fontSize: "15px",
  },
  paper: {
    padding: theme.spacing(0, 8),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
    // boxShadow: "0 2px 150px rgba(0, 0, 0, 0.4)",
  },
  image: {
    backgroundColor: "#6C63FF",
    backgroundSize: "cover",
    backgroundPosition: "30%",
  },
  target: {
    fontFamily: "'Pacifico', cursive",
    height: "90%",
    fontSize: "120px",
    textShadow: "4px 6px rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: "18px",
  },
  avatar: {
    backgroundColor: "#6C63FF",
    fontSize: "25px",
    height: "7%",
    width: "10%",
  },
}));

export default function Login() {
  const options = {
    position: 'bottom-left',
    style: {
      fontSize: '15px',
      textAlign: 'center',
    }
  }

  const classes = useStyles();
  const history = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar(options);

  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const et = e.target;
    if (!!et.id) setDetails({ ...details, [et.id]: et.value });
    else setDetails({ ...details, [et.name]: et.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.email || !details.password) {
      openSnackbar("Please fill all fields to login");
      return;
    }
    Axios.post(`${process.env.REACT_APP_HOST}/user/login/`, {
      email: details.email,
      password: details.password
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        sessionStorage.setItem("usertoken", res.data.token);
        // sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
        openSnackbar("Login Successful");
        history("/home");
      })
      .catch((err) => {
        openSnackbar("Invalid credentials");
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        alignContents="center"
        className={classes.image}
      >
        {/* <img src={Visualization}/> */}
        {/* <ForceGraph3D/> */}
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Hidden smDown>
            <Avatar className={classes.avatar}>
              <FaUserCheck />
            </Avatar>
          </Hidden>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RRDLink} to="/register">
                  Don't have an account? Sign Up
                </Link>
                <div style={{float: 'right'}}>
                  <Link component={RRDLink} to="/reset">
                    Forgot password?
                  </Link>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
