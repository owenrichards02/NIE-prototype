The app is created using Vite + React. The dev build can be run with npm run dev, allowing you to connect to the client using localhost in the browser.
You will need to create a .env file with the following keys, for the NIE mongoDB cluster:
    VITE_REALM_APP_KEY='xxxxxxxxx'
    VITE_REALM_EMAIL='xxxxxxxx'
    VITE_REALM_PASS='xxxxxxxx'

env variables must be prefixed with VITE_ to work.
They are queried with 'import.meta.env.VITE_keyname'

Fragments in the canvas are currently created by rendering HTML in an svg format. They currently do not scale properly within the fragment bounds, or implement any css styling within the html.
More info on how this can be done: https://ronvalstar.nl/render-html-to-an-image