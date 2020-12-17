import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import path from 'path';
import { fileURLToPath } from 'url';
import favicon from 'serve-favicon';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({
  store: memoryStore
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

app.use(express.static(path.join(__dirname, '/public')));

app.use(
  keycloak.middleware()
);

app.get('/', keycloak.protect(), function(req, res) {
  const profile = req.kauth.grant.access_token.content;
  res.render(path.join(__dirname+'/about.pug'), { title: "Title", userName: profile.name, status: "Connected" });
});

app.listen(3000, err => {
  if (err) {
    console.error(err);
  }
  {
    console.log(`APP Listen to port : 3000`);
  }
});