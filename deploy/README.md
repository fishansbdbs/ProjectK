# Project K Deployment Notes

Render hosts the Socket.IO server from `server/`.

Netlify hosts the Vite client from `client/`.

Wire them together with:

```env
VITE_SERVER_URL=https://YOUR-RENDER-SERVER.onrender.com
CLIENT_ORIGIN=https://YOUR-NETLIFY-SITE.netlify.app
```

The server health endpoint is:

```text
/health
```
