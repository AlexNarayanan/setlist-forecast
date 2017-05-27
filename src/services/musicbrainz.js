'use strict';
import Request from './request';

const request = new Request();

export default class MusicbrainzService {

    constructor() {
        this.host = 'musicbrainz.org';
        this.pathRoot = '/ws/2/artist/?query='
    }

    // Returns a promise that will return the unique identifier for a given artist
    getMusicbrainzID(artist) {

        // Set up request options
        const options = {
                headers: {
                    'User-Agent': 'setlist-forecast/0.0.1 ( alex.b.narayanan@gmail.com )'
                },
                host: this.host,
                path: `${this.pathRoot}artist:${artist}&limit=1&fmt=json`
            };

        console.info(`[LOG] New search submitted for: ${artist}`);
        console.info(`[LOG] Making musicbrainz request at: ${options.host}${options.path}`);
        return new Promise((resolve, reject) => {
            request.get(options).then((res) => {
                const artistID = res.artists[0].id;
                console.info(`[LOG] Retrieved id: ${artistID}`);
                return resolve(artistID || 'Data not formatted as expected');
            }).catch((err) => {
                return reject(err);
            });
        });

    }
}