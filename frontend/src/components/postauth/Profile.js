import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Divider,
  Grid,
  List,
  ListItem
} from "@material-ui/core";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";
import Male from './../../svg/male.svg'
import { useSnackbar } from 'react-simple-snackbar'
import Axios from "axios";

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
    width: '100%',
    padding: '1%'
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
    fontSize: '16px',
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
    margin:'1% 3%',
    paddingTop: '1%',
    width: '200px',
    float: 'left'
},
name: {
    fontSize: '250%',
    letterSpacing: '1px',
    wordSpacing: '7px',
    margin: '2% 0'
},
email: {
    fontSize: '100%',
    letterSpacing: '2px',
    marginBottom: '5px'
},
paper: {
  padding: theme.spacing(2, 2),
  margin: '1% ',
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F5F5DC",
  boxShadow: "0 2px 50px rgba(0, 0, 0, 0.4)"
},
answerpaper: {
  padding: theme.spacing(1, 8),
  margin: '1% 1% 0 1%',
  width: "100%",
  backgroundColor: "#F5F5DC",
  boxShadow: "0 2px 50px rgba(0, 0, 0, 0.4)",
},
answer: {
  float: "left",
  display: "flex",
  margin: '2px',
  width: '100%'
},
text: {

  fontSize: '16px',
},
readmorelink: {
  color: "blueviolet",
  textDecoration: "underline",
  letterSpacing: "1px",
  cursor: "pointer",
},
extracontent: {
  color: "cornflowerblue",
  fontWeight: "500"
}
}));

export default function Profile() {
  const options = {
    position: 'bottom-left',
    style: {
      fontSize: '15px',
      textAlign: 'center',
    }
  }

  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar(options);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [qna, setQna] = useState(null)
 
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_HOST}/user/profile/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`
      },
    })
      .then((res) => {
       setUser({ 
         firstName: res.data.data.first_name,
         lastName: res.data.data.last_name,
         email: res.data.data.email
        })
      })
      .catch((err) => {
        openSnackbar("Failed to load profile");
      });
  }, []);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_HOST}/qna/askquestion/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`
      },
    })
      .then((res) => {
        console.log(res.data)
       setQna(res.data.history)
      })
      .catch((err) => {
        openSnackbar("Failed to load user history");
      })
  }, [])

  useEffect(() => console.log(qna), [qna])

  return (
    <div className={classes.root}>
        <Grid container>
        <Grid className={classes.paper}>
            <img src={Male} alt='Avatar' className={classes.avatar}/>
            <div className={classes.profileDetails}>
                {
                    user ?
                        <div className={classes.table}>
                            <p className={classes.name}>{user.firstName} {user.lastName}</p>
                            <p className={classes.email}>{user.email}</p>
                        </div> :
                        null
                }
            </div>
        </Grid>
        {
            qna && qna.length > 0 ?
            <div style={{width: '100%'}}>
                <Typography variant="h5" style={{ margin : "1% 2%"}}>User History:</Typography>
                <List >
                  {qna.map((item, i) => (
                    <div>
                      <ListItem disablePadding>
                        <Grid className={classes.answerpaper}>
                        <div className={classes.answer}>
                            <p className={classes.text}><b>Q. {item.question}</b></p>
                        </div>
                        <div >
                          <br/>
                          {
                            item.answer.map((obj, idx) => 
                              <div className={classes.text}>
                                <p>{idx+1}. {obj}</p>
                              </div>
                            )
                          }
                        </div>
                        </Grid>
                      </ListItem>
                    </div>
                  ))}
                </List>
            </div> :
            null
          }
        </Grid>
    </div>
  );
}
