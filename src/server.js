import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import bodyParser from 'body-parser';
import routes from './routes';
import Artist from './models/artist';
import MusicbrainzService from './services/musicbrainz';
import SetlistfmService from './services/setlistfm';
import NotFoundPage from './components/NotFoundPage';

// initialize the server and configure support for ejs templates
const app = new Express();
const setlistfmService = new SetlistfmService();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));

// require express body parser for formatting HTTP requests
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

// universal routing and rendering
app.get('*', (req, res) => {
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {

            // in case of error display the error message
            if (err) {
                return res.status(500).send(err.message);
            }

            // in case of redirect propagate the redirect to the browser
            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }

            // generate the React markup for the current route
            let markup;
            if (renderProps) {
                // if the current route matched we have renderProps
                markup = renderToString(<RouterContext {...renderProps}/>);
            } else {
                // otherwise we can render a 404 page
                markup = renderToString(<NotFoundPage/>);
                res.status(404);
            }

            // render the index template with the embedded React markup
            return res.render('index', { markup });
        }
    );
});

// handler for form submission
app.post('/submit', (req, res) => {
    const artist = new Artist(),
        artistName = encodeURI(req.body.artistName);

    artist.populateData(artistName).then((mbid) => {
        return res.send({ status: 'OK', id: mbid });
    }).catch((err) => {
        console.info(`[ERROR] ${err}`);
        return res.send({ status: 'OK', id: 'Error' });
    });
    /*setlistfmService.getMBID(artist).then((mbid) => {
        return res.send({ status: 'OK', id: mbid });
    }).catch((err) => {
        console.info(`[ERROR] ${err}`);
        return res.send({ status: 'OK', id: 'Error' });
    });*/
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
});