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
import { useSnackbar } from 'react-simple-snackbar'
import Axios from "axios";
import { SignalCellularNull } from "@material-ui/icons";

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
    width: '100%',
    padding: '1% 3%'
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
  paper: {
    padding: theme.spacing(5, 8),
    margin: '1%',
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
    boxShadow: "0 2px 50px rgba(0, 0, 0, 0.4)",
  },
  answerpaper: {
    padding: theme.spacing(1, 8),
    margin: '1%',
    width: "100%",
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
  submit: {
    marginTop: '1%'
  },
  answer: {
    float: "left",
    display: "flex",
    margin: '1%',
    width: '100%'
  },
  text: {
    padding: '0 2%',
    fontSize: '16px',
    float: "left"
  }
}));

export default function Question() {
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

  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState(null)

  const handleChange = (e) => {
    setAnswer(null)
    setQuestion(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!question) {
      openSnackbar("Please enter a question")
      return
    }
    Axios.post(`${process.env.REACT_APP_HOST}/qna/askquestion/`, {
      question_text: question
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`
      },
    })
      .then((res) => {
        setAnswer(res.data.answer)
      })
      .catch((err) => {
        openSnackbar("Failed to retrieve answer");
      });
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
          {
            answer ?
            <Grid  className={classes.answerpaper}>
                <div className={classes.answer}>
                    <p className={classes.title}><b>Question:</b></p>
                    <br/>
                    <p className={classes.text}>{question}</p>
                </div>
                <div className={classes.answer}>
                  <p className={classes.title}><b>Answer:</b></p>
                  <br/>
                  <p className={classes.text}>{answer}</p>
                </div>
            </Grid> :
            null
          }
        </Grid>
    </div>
  );
}
