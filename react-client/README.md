# NIE Prototype

## Vite App Instructions
The app is created using Vite + React. The dev build can be run with the following command, allowing you to connect to the client using localhost in the browser.
```bash
npm run dev
```


You will need to create a .env file with the following keys, for the NIE mongoDB cluster:

```
    VITE_REALM_APP_KEY='xxxxxxxxx'  # Realm app ID
    VITE_REALM_EMAIL='xxxxxxxx'     # Realm app username
    VITE_REALM_PASS='xxxxxxxx'      # Realm user's password
    VITE_REALM_DB='xxx'             # Database name within the mongo cluster
```

env variables must be prefixed with VITE_ to work.They are queried with 
```javascript
const key = import.meta.env.KEYNAME
// for example
const realm_key = import.meta.env.VITE_REALM_APP_KEY
```

## Implementation Notes
Fragments in the canvas are currently created by rendering HTML in an svg format. They currently do not scale properly within the fragment bounds, or implement any css styling within the html.

More info on how this can be changed: https://ronvalstar.nl/render-html-to-an-image
