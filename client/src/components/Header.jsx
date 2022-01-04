import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { 
  AppBar,
  Toolbar, 
  Typography,
  Modal,
  Paper,
  Link
} from "@material-ui/core";

import { Box } from "@material-ui/core";

import useMediaQuery from '@material-ui/core/useMediaQuery';

import Context from '../context';
import Signout from './Auth/Signout';
import LoginModal from './Auth/LoginModal';

const Header = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  const { state } = useContext(Context);
  const { currentUser } = state;

  // Modal State
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const handleOpenLoginModal = () => setOpenLoginModal(true);
  const handleCloseLoginModal = () => setOpenLoginModal(false);

  return <div className={classes.root}>
    <AppBar position="static"> 
      <Toolbar> 
        { /* Title Logo*/}
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
            <img className={classes.logo} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-roller-skates-50_q5iys5.png" alt="Skate"/>
            <img className={classes.logo} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-50_hpu6mg.png" alt="Skate"/>
            <img className={classes.logo} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-rollerblade-50_kq6iwt.png" alt="Skate"/>
            <img className={classes.logo} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-heart-50_kgwnbw.png" alt="Skate"/>
            <Typography
            className={mobileSize ? classes.mobileTitle : classes.title }
            component="h1"
            variant="h5"
            color="inherit"
            noWrap>
              skatespot.app
            </Typography>
          </Box>
        {currentUser ? (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box mr={1}>
              <Signout></Signout>
            </Box>
            <Box mr={1}>
              <Typography
                className={mobileSize ? classes.mobileName : ""}
                variant="h6"
                color="inherit"
                noWrap>
                {currentUser.username}
              </Typography>
            </Box>
            {currentUser.picture && (
              <img className={classes.picture}
              src={currentUser.picture}
              alt="Pic"
            />
            )}
          </Box>
        ) : 
        (
          <Box>
            <Link 
              component="button" 
              variant="body2"
              className={classes.loginLink}
              onClick={handleOpenLoginModal}>
              About
            </Link>
            <Link 
              component="button" 
              variant="body2"
              className={classes.loginLink}
              onClick={handleOpenLoginModal}>
              Log In
            </Link>
          </Box>
        )}
        </Box>
      </Toolbar>
      <Modal
        open={openLoginModal}
        onClose={handleCloseLoginModal}>
        <Paper className={classes.panel}>
          <Box>
            <LoginModal onSuccess={handleCloseLoginModal}></LoginModal>
          </Box>
        </Paper>
      </Modal>
    </AppBar>
  </div>;
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing(1),
    color: "green",
    fontSize: 45
  },
  logo: {
    height: '2.5em',
  },
  mobileTitle: {
    fontSize: '2.5em',
    marginLeft: '5px'
  },
  title: {
    fontSize: '2.5em',
    marginLeft: '10px'
  },
  mobileName: {
    display: 'none'
  },
  picture: {
    height: "35px",
    borderRadius: "90%",
    marginRight: theme.spacing(2)
  },
  panel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 50
  },
  loginLink: {
    color: 'white',
    fontSize: '1.3em',
    marginRight: '0.5em'
  }
});

export default withStyles(styles)(Header);
