import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  IconButton,
  Grid,
  Button,
  TextField
} from "@material-ui/core";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import { VpnKey, AccessibilityNew } from "@material-ui/icons";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        fontSize: "15px",
      },
  avatar2: {
    color: "#FFFFFF",
    backgroundColor: "#E50058",
  },
  avatar: {
    color: "#FFFFFF",
    backgroundColor: "#193B55",
  },
  root: {
    display: "flex",
    width: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: { marginRight: theme.spacing(2) },
  title: {
    //fontFamily: "'Pacifico', cursive",
    flexGrow: 1,
    display: "none",
    color: "#6C63FF",
    fontWeight: '500',
    textTransform: 'uppercase',
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    justifyContent: 'center'
  },
  paper: {
    padding: theme.spacing(1, 8),
    margin: '1%',
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
    boxShadow: "0 2px 50px rgba(0, 0, 0, 0.4)",
  },
  paper2: {
    padding: theme.spacing(1, 8),
    margin: '1%',
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
    boxShadow: "0 2px 50px rgba(0, 0, 0, 0.4)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  list: {
    paddingLeft: theme.spacing(1),
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.8)",
  },
  listItem: {
    padding: "0 auto",
  },
}));

export default function Question() {
  const classes = useStyles();

  const location = useLocation();
  const history = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    is_admin: 1,
    reg_id: "",
    division: null,
    roleName: null,
    subName: null,
    year: null,
  });
 
  const handleChange = (e) => {

  }

  const handleSubmit = (e) => {

  }

  return (
    <div className={classes.root}>
        <Grid container>
      <Grid className={classes.paper}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="question"
              label="Question"
              name="question"
              autoComplete="question"
              autoFocus
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              style={{ width: "10%"}}
            >
              Ask Question
            </Button>
          </form>
        </Grid>
        <Grid className={classes.paper2}>
            <Typography variant="h5" className={classes.title}>Answer</Typography>
        </Grid>
        </Grid>
    </div>
  );
}
