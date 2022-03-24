import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Button,
  TextField
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from 'react-simple-snackbar'
import Typed from 'react-typed';
import Axios from "axios";
import Loader from "react-js-loader";


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
    margin: '1%',
    width: '100%'
  },
  text: {
    fontSize: '15px'
  },
  blinker: {
    marginTop: '2%',
    fontSize: '1.5rem'
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

  const stringArray = [
    "The information covered by Google's Knowledge Graph grew quickly after launch, tripling its size within seven months.",
    "Neo4j is the world's most popular graph database management system.",
    "Google reported that it held 70 billion facts and answered \"roughly one-third\" of the 100 billion monthly searches they handled.",
    "Diffbot is the world's largest knowledge graph that allows you to access a trillion connected facts across the web.",
    "Just a few moments more! We are crawling through the graph to get you your answer!"

  ];
  const typeSpeed = 45;
  const backSpeed = 10;

  const [openSnackbar, closeSnackbar] = useSnackbar(options);

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loader, setLoader] = useState(false);

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
    setLoader(true)
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
        setLoader(false)
      })
      .catch((err) => {
        openSnackbar("Failed to retrieve answer");
        setLoader(false)
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
                  <p className={classes.title}><b>Answers:</b></p>
                  <br/>
                  {
                    answer.map((obj, idx) => 
                      <div className={classes.text}>
                        <p>{idx+1}. {obj}</p>
                      </div>
                    )
                  }
                </div>
            </Grid> :
            loader ?
            <>            
              <Grid container spacing={2} justify="center" style={{marginTop: '2%'}}>
                <Loader type="spinner-circle" bgColor={"#6C63FF"} color={'#6C63FF'} size={100}/>
              </Grid>            
              <Grid container spacing={1} justify="center">
                <Typed
                    strings={stringArray}
                    typeSpeed={typeSpeed}
                    backSpeed={backSpeed}
                    className={classes.blinker}
                    loop
                />
              </Grid>
            </>

            : null
          }
        </Grid>
    </div>
  );
}
