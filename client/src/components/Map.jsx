import React, { useState, useEffect, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Map, { NavigationControl, Marker, Popup, useMap } from 'react-map-gl';
import { styled } from '@mui/material/styles';
import { useSubscription } from '@apollo/client';
import { differenceInMinutes } from 'date-fns';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import PinIcon from './PinIcon';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import {
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_ADDED_SUBSCRIPTION,
} from '../graphql/subscriptions';
import Blog from './Blog';
import Context from '../context';
import { config } from '../config';

// Default center: Calgary (app is yyc-skatespots) until geolocation succeeds
const INITIAL_VIEWPORT = {
  latitude: 51.0447,
  longitude: -114.0719,
  zoom: 11,
};

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

function readPosition(position) {
  const { latitude, longitude, accuracy } = position.coords;
  return { latitude, longitude, accuracy };
}

const Root = styled('div', {
  shouldForwardProp: (prop) => prop !== 'mobile',
})(({ mobile }) => ({
  display: 'flex',
  flexDirection: mobile ? 'column-reverse' : undefined,
}));

const MapControls = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  margin: '1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 1,
});

function LocateMeButton({ onLocated }) {
  const map = useMap();

  const handleClick = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = readPosition(position);
        onLocated(coords);
        map?.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: Math.max(map.getZoom(), 14),
          duration: 1200,
        });
      },
      (err) => console.error('Geolocation error', err),
      GEO_OPTIONS,
    );
  };

  return (
    <Tooltip title="Go to my location (uses GPS when available)">
      <IconButton
        onClick={handleClick}
        aria-label="Go to my location"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <MyLocationIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}

const MapView = () => {
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [popup, setPopup] = useState(null);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  useSubscription(PIN_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinAdded) {
        dispatch({ type: 'CREATE_PIN', payload: data.data.pinAdded });
      }
    },
  });

  useSubscription(PIN_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinUpdated) {
        dispatch({ type: 'CREATE_COMMENT', payload: data.data.pinUpdated });
      }
    },
  });

  useSubscription(PIN_DELETED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinDeleted) {
        dispatch({ type: 'DELETE_PIN', payload: data.data.pinDeleted });
      }
    },
  });

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);

  const getPins = async () => {
    const { getPins: pins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: pins });
  };

  useEffect(() => {
    const pinExists =
      popup && state.pins.findIndex((pin) => pin._id === popup._id) > -1;
    if (!pinExists) {
      setPopup(null);
    }
  }, [state.pins.length, popup, state.pins]);

  const applyUserPosition = ({ latitude, longitude, accuracy }) => {
    setUserPosition({ latitude, longitude });
    if (accuracy != null) setLocationAccuracy(accuracy);
    setViewport((v) => ({
      ...v,
      latitude,
      longitude,
      zoom: Math.max(v.zoom, 14),
    }));
  };

  const getUserPosition = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => applyUserPosition(readPosition(position)),
      (err) => console.error('Geolocation error', err),
      GEO_OPTIONS,
    );
  };

  const handleMapClick = (evt) => {
    if (evt.originalEvent.button !== 0) return;
    if (!state.isAuth) return;
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' });
    }
    const { lng: longitude, lat: latitude } = evt.lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude },
    });
  };

  const isNewPin = (pin) =>
    differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  const handleDeletePin = async (pin) => {
    await client.request(DELETE_PIN_MUTATION, { pinId: pin._id });
    setPopup(null);
  };

  const isAuthUser = () =>
    state.currentUser && popup && state.currentUser._id === popup.author._id;

  return (
    <Root mobile={mobileSize}>
      <Map
        mapboxAccessToken={config.mapboxToken}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
        scrollZoom={!mobileSize}
        style={{ width: '100vw', height: 'calc(100vh - 64px)' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <MapControls>
          <NavigationControl position="top-left" />
          <LocateMeButton onLocated={applyUserPosition} />
        </MapControls>

        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            anchor="bottom"
          >
            <PinIcon
              size={40}
              color="red"
              title={
                locationAccuracy != null
                  ? `You (±${Math.round(locationAccuracy)} m)`
                  : 'You'
              }
            />
          </Marker>
        )}

        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            anchor="bottom"
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {state.pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            anchor="bottom"
          >
            <PinIcon
              size={40}
              title={pin.title}
              onClick={() => handleSelectPin(pin)}
              isNewPin={isNewPin(pin)}
            />
          </Marker>
        ))}

        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              style={{
                padding: '0.4em',
                height: 200,
                width: 200,
                objectFit: 'cover',
              }}
              src={popup.image}
              alt={popup.title}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon sx={{ color: 'red' }} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </Map>
      <Blog />
    </Root>
  );
};

export default MapView;
