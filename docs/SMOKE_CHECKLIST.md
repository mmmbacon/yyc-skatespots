# Smoke checklist

Run after each modernization phase. Requires MongoDB (`npm run db:up`), backend (`npm run dev`), and client (`cd client && npm run dev`).

## Startup

- [ ] Backend logs `DB Connected!` and `Server ready at http://localhost:4000/graphql`
- [ ] Client opens at http://localhost:3000 and loads the map without build errors

## Auth

- [ ] App loads map at `/` without requiring sign-in
- [ ] Header shows Google sign-in when logged out; successful login shows user name/avatar
- [ ] Sign out returns to logged-out state

## Pins (HTTP)

- [ ] Map loads with existing pins from `getPins`
- [ ] Click map creates draft pin (pink marker)
- [ ] Create pin with title, image, and description succeeds
- [ ] Click pin opens popup and blog sidebar content
- [ ] Delete own pin removes it from map

## Comments

- [ ] Add comment on a pin updates sidebar comments list

## Realtime (WebSocket)

- [ ] Second browser/tab: new pin appears without refresh
- [ ] Comment on pin syncs to other tab
- [ ] Deleted pin disappears in other tab
