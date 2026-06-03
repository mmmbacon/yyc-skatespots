import React, { useState, useEffect, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Map, { NavigationControl, Marker, Popup, useMap } from 'react-map-gl';
import { styled } from '@mui/material/styles';
import { useSubscription } from '@apollo/client';
import { differenceInMinutes } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import PinIcon from './PinIcon';
import PinPopover from './Pin/PinPopover';
import CommentDrawer from './Comment/CommentDrawer';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import {
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_ADDED_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { useAppStore } from '../stores/useAppStore';
import { config, MAP_AREA_HEIGHT } from '../config';

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

const MapArea = styled('div')({
  position: 'relative',
  width: '100vw',
  height: MAP_AREA_HEIGHT,
  overflow: 'hidden',
});

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
  const pins = useAppStore((state) => state.pins);
  const draft = useAppStore((state) => state.draft);
  const isAuth = useAppStore((state) => state.isAuth);
  const currentUser = useAppStore((state) => state.currentUser);
  const addPin = useAppStore((state) => state.addPin);
  const updatePin = useAppStore((state) => state.updatePin);
  const deletePin = useAppStore((state) => state.deletePin);
  const setPins = useAppStore((state) => state.setPins);
  const createDraft = useAppStore((state) => state.createDraft);
  const updateDraftLocation = useAppStore((state) => state.updateDraftLocation);
  const setCurrentPin = useAppStore((state) => state.setCurrentPin);
  const mapRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  useSubscription(PIN_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinAdded) {
        addPin(data.data.pinAdded);
      }
    },
  });

  useSubscription(PIN_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinUpdated) {
        updatePin(data.data.pinUpdated);
      }
    },
  });

  useSubscription(PIN_DELETED_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data?.pinDeleted) {
        deletePin(data.data.pinDeleted);
      }
    },
  });

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);

  const getPins = async () => {
    const { getPins: pins } = await client.request(GET_PINS_QUERY);
    setPins(pins);
  };

  useEffect(() => {
    const pinExists =
      popup && pins.findIndex((pin) => pin._id === popup._id) > -1;
    if (!pinExists) {
      setPopup(null);
    }
  }, [pins.length, popup, pins]);

  useEffect(() => {
    setCommentDrawerOpen(false);
  }, [popup?._id]);

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
    if (!isAuth) return;
    if (!draft) {
      createDraft();
    }
    const { lng: longitude, lat: latitude } = evt.lngLat;
    updateDraftLocation({ longitude, latitude });
  };

  const isNewPin = (pin) =>
    differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;

  const handleSelectPin = (pin) => {
    setPopup(pin);
    setCurrentPin(pin);
    mapRef.current?.flyTo({
      center: [pin.longitude, pin.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 14),
      duration: 1000,
    });
  };

  const handleDeletePin = async (pin) => {
    await client.request(DELETE_PIN_MUTATION, { pinId: pin._id });
    setPopup(null);
  };

  const activePin = popup
    ? pins.find((p) => p._id === popup._id) ?? popup
    : null;

  const isPinOwner = (pin) =>
    currentUser && pin && currentUser._id === pin.author._id;

  return (
    <Root mobile={mobileSize}>
      <MapArea>
      <Map
        ref={mapRef}
        mapboxAccessToken={config.mapboxToken}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
        scrollZoom={!mobileSize}
        style={{ width: '100%', height: '100%' }}
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

        {draft && (
          <Marker
            latitude={draft.latitude}
            longitude={draft.longitude}
            anchor="bottom"
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            anchor="bottom"
          >
            <PinIcon
              size={40}
              title={pin.title}
              onClick={(event) => {
                event.stopPropagation();
                handleSelectPin(pin);
              }}
              isNewPin={isNewPin(pin)}
            />
          </Marker>
        ))}

        {activePin && (
          <Popup
            anchor="top"
            latitude={activePin.latitude}
            longitude={activePin.longitude}
            closeOnClick={false}
            maxWidth="360"
            onClose={() => setPopup(null)}
          >
            <PinPopover
              pin={activePin}
              showDelete={isPinOwner(activePin)}
              onDelete={() => handleDeletePin(activePin)}
              onOpenCommentDrawer={() => setCommentDrawerOpen(true)}
            />
          </Popup>
        )}
      </Map>
      <CommentDrawer
        open={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        pinId={activePin?._id}
        pinTitle={activePin?.title}
        comments={activePin?.comments}
        isAuth={isAuth}
      />
      </MapArea>
    </Root>
  );
};

export default MapView;
