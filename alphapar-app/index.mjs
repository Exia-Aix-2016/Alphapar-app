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
  keycloak.middleware({
    logout: '/logout',
    admin: '/'
  })
);


app.get('/', function(req, res) {
  res.render(path.join(__dirname+'/about.pug'), { title: "Title", userName: "Jean-Didier", status: "Connected" });
});

app.get('/api/user', keycloak.protect('realm:user'), function(req, res) {
  res.sendFile(path.join(__dirname+'/about.pug'));
});


app.listen(3000, err => {
  if (err) {
    console.error(err);
  }
  {
    console.log(`APP Listen to port : 3000`);
  }
});