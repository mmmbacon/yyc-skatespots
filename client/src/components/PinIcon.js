import React from "react";
import { makeStyles } from "@material-ui/core";
import PlaceTwoTone from "@material-ui/icons/PlaceTwoTone";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    marginLeft: '0px',
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

export default ({size, title, color, isNewPin, onClick }) => {
  return (    
    
    <BootstrapTooltip title={title} aria-label="Pin" placement="right" TransitionComponent={Zoom}>
      <PlaceTwoTone 
        onClick={onClick} 
        style={{ fontSize: size, color : isNewPin ? "limegreen" : color || "darkblue" }}>
        PinIcon
      </PlaceTwoTone>
    </BootstrapTooltip>
  );
};
