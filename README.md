# Firebase Meetup

A web app for a meetup event where users can sign in, RSVP to the event, and leave messages in a real-time guestbook.

Live demo: [meetapp-479fa.web.app](https://meetapp-479fa.web.app)

## Features

- Email/password authentication (FirebaseUI)
- RSVP to the event (Yes/No), with a live-updating count of attendees
- Real-time guestbook messages (Firestore `onSnapshot`)
- Live data sync across all connected users

## Tech stack

- [Vite](https://vitejs.dev/) — build tool
- [Firebase](https://firebase.google.com/) — Authentication & Firestore
- [FirebaseUI](https://github.com/firebase/firebaseui-web) — auth widget
- Firebase Hosting

## Getting started

### Requirements

- Node.js
- A Firebase project (with Email/Password authentication and Firestore enabled)

### Install

```bash
npm install
```

### Configure Firebase

The Firebase configuration lives in [index.js](index.js), in the `firebaseConfig` object. Replace it with your own Firebase project's values (Project Settings → General → Your apps).

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

The build output is generated in the `dist/` folder.

### Preview the build

```bash
npm run preview
```

## Deploy to Firebase Hosting

```bash
firebase deploy
```

(requires the [Firebase CLI](https://firebase.google.com/docs/cli) installed and authenticated: `npm install -g firebase-tools` + `firebase login`)

## Project structure

```
├── index.html      # Page markup
├── index.js        # App logic (auth, RSVP, guestbook)
├── style.css        # Styles
├── firebase.json    # Firebase Hosting configuration
└── .firebaserc      # Firebase project alias
```

## License

This project is licensed under the [Apache License 2.0](LICENSE.txt).
