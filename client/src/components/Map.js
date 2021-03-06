import React, { useState, useEffect, useContext } from "react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';

import { withStyles } from "@material-ui/core/styles";
import PinIcon from './PinIcon';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { Subscription } from "react-apollo";

import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import { PIN_UPDATED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION, PIN_ADDED_SUBSCRIPTION} from '../graphql/subscriptions';
import Blog from './Blog';
import Context from '../context';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}
const Map = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width: 650px)');
  const client = useClient();
  const { state, dispatch} = useContext(Context);
  const [popup, setPopup] = useState(null);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
  }

  useEffect(()=>{
    const pinExists = popup && state.pins.findIndex(pin => pin._id === popup._id) > -1;
    if(!pinExists){
      setPopup(null);
    }
  }, [state.pins.length]);

  const getUserPosition = () =>{
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  }

  const handleMapClick = ({ lngLat, leftButton}) => {
    if(!leftButton) return;
    if(!state.draft){
      dispatch({ type: "CREATE_DRAFT"})
    }
    const [ longitude, latitude ] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    })
  }

  const isNewPin = pin =>{
    return differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
  }

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin});
  }

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id }
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id

  return <div className={mobileSize ? classes.rootMobile : classes.root }>
    <ReactMapGL
    scrollZoom={!mobileSize}
    width="100vw"
    height="calc(100vh - 64px)"
    mapStyle="mapbox://styles/mapbox/streets-v9"
    mapboxApiAccessToken="pk.eyJ1IjoibW1tYmFjb24iLCJhIjoiY2tyM242cmQ1MjB6OTJ2cXVreDBseWppZyJ9._cnVKPCKgZVGX6Otei3Jlw"
    onViewportChange={setViewport}
    {...viewport}
    onClick={handleMapClick}
    >
      {/* Navigation Control */}
      <div className={classes.navigationControl}>
        <NavigationControl
          onViewportChange={setViewport}
        ></NavigationControl>
      </div>

      {/* Pin for the users current location */}
      {userPosition && (
        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <PinIcon
            size={40}
            color="red"
          ></PinIcon>
        </Marker>
      )}
      
      {/* Draft Pin */}
      {state.draft && (
        <Marker
        latitude={state.draft.latitude}
        longitude={state.draft.longitude}
        offsetLeft={-19}
        offsetTop={-37}
      >
        <PinIcon
          size={40}
          color="hotpink"
        ></PinIcon>
      </Marker>
      )}

      {/* Created Pins */}
      {state.pins.map(pin => (
        <Marker
        key={pin._id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        offsetLeft={-19}
        offsetTop={-37}
      >
        <PinIcon
          size={40}
          title={pin.title}
          onClick={()=> handleSelectPin(pin)}
          isNewPin={ isNewPin(pin) }
        ></PinIcon>
      </Marker>
      ))}

      {/* Popup Dialog for created pins */}
      {popup && (
        <Popup
          anchor="top"
          latitude={popup.latitude}
          longitude={popup.longitude}
          closeOnClick={false}
          onClose={()=> setPopup(null)}
        >
          <img 
            className={classes.popupImage}
            src={popup.image}
            alt={popup.title} />
          <div className={classes.popupTab}>
            <Typography>
              {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
            </Typography>
            {isAuthUser() && (
              <Button onClick={() => handleDeletePin(popup)}>
                <DeleteIcon 
                  className={classes.deleteIcon}
                ></DeleteIcon>
              </Button>
            )}
          </div>
        </Popup>
      )}

    </ReactMapGL>

    {/* Subscriptions for Creating / Updating and Deleting Pins */}
    <Subscription
      subscription={PIN_ADDED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const { pinAdded } = subscriptionData.data;
        dispatch({ type: "CREATE_PIN", payload: pinAdded })
      }}
    ></Subscription>
    <Subscription
      subscription={PIN_UPDATED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const { pinUpdated } = subscriptionData.data;
        dispatch({ type: "CREATE_COMMENT", payload: pinUpdated })
      }}
    ></Subscription>
    <Subscription
      subscription={PIN_DELETED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const { pinDeleted } = subscriptionData.data;
        dispatch({ type: "DELETE_PIN", payload: pinDeleted })
      }}
    ></Subscription>

    {/* Blog Area To Add Pin Content */}
    <Blog></Blog>
  </div>;
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
