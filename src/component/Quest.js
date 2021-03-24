import React, { useState, useEffect } from "react";
import { TextField, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  answer: {
    width: theme.spacing(75),
  },
}));

const Quest = (props) => {
  const [answer, setAnswer] = useState("");
  const [object, setObject] = useState({ fldModel: props.answer, fldName: props.fldName });
  const classes = useStyles();

  const handleAnswers = (event) => {
    setAnswer(event.target.value);
    localStorage.setItem("taskId", props.task.taskID);
    //lets construct an state for sending back to parent component

    const { name } = event.target;
    setObject({ ...object, [name]: event.target.value });

    // lets send the object state back to onchange came by prop
    props.onChange(object);
  };

  useEffect(() => {
    setAnswer(props.answer);
  }, []);
  return (
    <TextField
      className={classes.answer}
      id={props.fldName}
      label="Type your text here"
      onChange={handleAnswers}
      name="fldModel"
      value={answer}
    />
  );
};
export default Quest;
