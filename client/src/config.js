export const config = {
  graphqlHttpUrl:
    import.meta.env.VITE_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
  graphqlWsUrl:
    import.meta.env.VITE_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
};
