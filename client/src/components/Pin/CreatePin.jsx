import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from '../../client';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const CreatePin = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  const client = useClient();
  const {state, dispatch} = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () =>{
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT"})
  }

  const handleSubmit = async event => {
    try{
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude }
      await client.request(CREATE_PIN_MUTATION, variables);
      handleDeleteDraft();
    }catch(err){
      setSubmitting(false);
      console.error("Error creating pin", err);
    }
  }

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopinr");
    data.append("cloud_name", "mmmbacon");
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/mmmbacon/image/upload',
      data,
    );
    return res.data.url;
  }
 
  return (
    <form className={classes.form}>
      <Box ml={1.5}>
        { image ? (
          <img src={image && URL.createObjectURL(image)} alt="preview" width="100%"/>
        ) : (
          <Box p={1}>
            <img src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-100_ts7wrr.png" alt="preview" width="100%"/>
          </Box>
        )}
      </Box>
      <Typography 
        className={classes.alignCenter}
        component="h2"
        variant="h6"
        color="primary"
        align="center"
        >
        Post a new skate spot
      </Typography>
      <Box p={1}>
        <TextField
          name="title"
          label="title"
          placeholder="Skate Spot Title"
          onChange={ e => setTitle(e.target.value)}>    
        </TextField>
        <input
          accept="image"
          id="image"
          type="file"
          className={classes.input}
          onChange={ e => setImage(e.target.files[0])}>  
        </input>
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image && "green"}}
          >
            <AddAPhotoIcon></AddAPhotoIcon>
          </Button>
        </label>
      </Box>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Spot Description and Notes"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={ e => setContent(e.target.value)}
        ></TextField>
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon}></ClearIcon>
          Discard
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting }
          onClick={handleSubmit}
        >
          <SaveIcon className={classes.rightIcon}></SaveIcon>
          Submit
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing(1)
  },
  contentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing(1)
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
