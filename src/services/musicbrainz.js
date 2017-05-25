'use strict';
import http from 'http';
import Request from './request';

const request = new Request();

export default class MusicbrainzService {

    constructor() {
        this.host = 'musicbrainz.org';
        this.pathRoot = '/ws/2/artist/?query='
    }

    // Returns the unique musicbrainz identifier for a given artist
    getMusicbrainzID(artist) {

        // Set up request options
        const options = {
                headers: {
                    'User-Agent': 'setlist-forecast/0.0.1 ( alex.b.narayanan@gmail.com )'
                },
                host: this.host,
                path: `${this.pathRoot}artist:${artist}&limit=1&fmt=json`
            };

        console.info(`[LOG] Making musicbrainz request at: ${options.host}${options.path}`);
        return request.get(options);

        // Return the request as a promise
        /*const req = http.get(options, (stream) => {
            let res = '';
            console.log(`[LOG] Response status${stream.statusCode}]`);

            if (stream.statusCode === 200) {

                stream.on('data', function (chunk) {
                    res += chunk;
                });

                stream.on('end', function () {
                    res = JSON.parse(res);
                    console.log(res.artists[0].id);
                    return res.artists[0].id || 'Data not formatted as expected';
                });
            }

            return 'Something went wrong, try again';
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req.end();*/

    }

}