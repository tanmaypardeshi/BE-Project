import React, { useState, useEffect } from "react";
import {
  makeStyles,
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Tooltip,
} from "@material-ui/core";
import {
  ExitToApp,
} from "@material-ui/icons";
import { IoPersonSharp } from 'react-icons/io5'
import MainRoutes from "./MainRoutes";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import { VpnKey, AccessibilityNew } from "@material-ui/icons";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
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
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: { marginRight: theme.spacing(2) },
  title: {
    fontFamily: "'Pacifico', cursive",
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
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
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflowX: "none",
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

export default function ClippedDrawer() {
  const classes = useStyles();

  const location = useLocation();
  const history = useNavigate();

  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/staff/update/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setUser(user);
        let jsonObj = JSON.parse(sessionStorage.getItem("user"));
        jsonObj.firstName = user.firstName;
        jsonObj.lastName = user.lastName;
        jsonObj.email = user.email;
        sessionStorage.setItem("user", JSON.stringify(user));
        handleDialog(false);
        // enqueueSnackbar("Update Successful", { variant: "success" });
      })
      .catch((err) => {
        // enqueueSnackbar("Could not update", { variant: "error" });
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("usertoken");
    sessionStorage.removeItem("user");
    history("");
  };

  const handleDialog = () => {
    setDialog(!dialog);
  };

  const handleProfile = () => {
      history("/home/profile")
  }

//   const getDetails = () => {
//     Axios.get(
//       `${process.env.REACT_APP_HOST}/api/staff/${
//         JSON.parse(sessionStorage.getItem("user")).reg_id
//       }`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
//         },
//       }
//     ).then((res) => {
//       setUser(res.data.data[0]);
//       setIsAdmin(() => (res.data.data[0].is_admin === 0 ? false : true));
//     });
//   };
//   useEffect(() => {
//     getDetails();
//   }, []);

  useEffect(() => {
    // let user = sessionStorage.getItem("user");
    // if (!user) {
    //   history.push("/");
    // }
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          
          <Typography variant="h5" className={classes.title}>
            Knowledge Graph-based Question Answering
          </Typography>
          <IconButton onClick={handleProfile} style={{marginRight: "5px"}}>
            <Tooltip title="Profile">
              <IoPersonSharp style={{ height: "22px", color: "#ffffff" }} />
            </Tooltip>
            {/* <Typography
              variant="body1"
              style={{ paddingLeft: "2%", color: "#fff" }}
            >
              Logout
            </Typography> */}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <Tooltip title="Logout">
              <ExitToApp style={{ height: "25px", color: "#ffffff" }} />
            </Tooltip>
            {/* <Typography
              variant="body1"
              style={{ paddingLeft: "2%", color: "#fff" }}
            >
              Logout
            </Typography> */}
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar />
        <Grid container spacing={1} direction="row">
          <MainRoutes />
        </Grid>
      </main>
    </div>
  );
}
