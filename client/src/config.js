/** AppBar + Toolbar height; keep in sync with map layout */
export const HEADER_HEIGHT = 64;
export const MAP_AREA_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

/** Served from client/public/default_image.png */
export const DEFAULT_PIN_IMAGE = '/default_image.png';

/** Served from client/public/default_avatar.png */
export const DEFAULT_AVATAR = '/default_avatar.png';

export const config = {
  graphqlHttpUrl:
    import.meta.env.VITE_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
  graphqlWsUrl:
    import.meta.env.VITE_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  defaultPinImage: DEFAULT_PIN_IMAGE,
};

export function pinImageSrc(image) {
  return image || DEFAULT_PIN_IMAGE;
}

const LEGACY_AVATAR_PICTURES = new Set([
  DEFAULT_PIN_IMAGE,
  'https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-50_hpu6mg.png',
]);

export function avatarSrc(picture) {
  if (!picture || LEGACY_AVATAR_PICTURES.has(picture)) {
    return DEFAULT_AVATAR;
  }
  if (typeof picture === 'string' && picture.includes('icons8-skateboard')) {
    return DEFAULT_AVATAR;
  }
  return picture;
}
