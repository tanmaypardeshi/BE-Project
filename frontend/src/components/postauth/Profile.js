import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  IconButton,
  Grid,
  Button,
  TextField,
  Card
} from "@material-ui/core";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";
import Male from './../../svg/male.svg'
import Axios from "axios";

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
    color: "#E50058",
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
  card: {
    margin: '2%',
    display:'inline block',
},
table: {
    width: '50%',
    margin: '2% 0',
    float: 'left'
},
profileDetails: {
    marginTop: '38px'
},
avatar: {
    padding: '1% 0',
    margin:'1% 3%',
    width: '250px',
    float: 'left'
},
name: {
    fontSize: '250%',
    letterSpacing: '1px',
    wordSpacing: '7px',
    margin: '4px 0'
},
email: {
    fontSize: '100%',
    letterSpacing: '2px',
    marginBottom: '10px'
},
dept: {
    color: '#696969',
    fontSize: '98%'
}
}));

export default function Profile() {
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

  const [profile, setProfile]= useState(null)
 
  const handleChange = (e) => {

  }

  const handleSubmit = (e) => {

  }

  return (
    <div className={classes.root}>
        <Grid container>
        <Grid className={classes.paper}>
            <img src={Male} alt='Avatar' className={classes.avatar}/>
            <div>
                {
                    profile ?
                        <div className={classes.table}>
                            <p className={classes.name}>{profile.first_name} {profile.last_name}</p>
                            <p className={classes.email}>{profile.email}</p>
                            <p className={classes.dept}>Employee</p>
                        </div> :
                        null
                }
            </div>
        </Grid>
        {/* <Grid className={classes.paper2}>
            <Typography variant="h5" className={classes.title}>Answer</Typography>
        </Grid> */}
        </Grid>
    </div>
  );
}
