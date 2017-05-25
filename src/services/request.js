'use strict';
import http from 'http';

export default class Request {

    // Promise wrapper for the request method from the http library
    // Takes in options object inherited from the parent function
    get(options) {
        return new Promise(function(resolve, reject) {
            const req = http.get(options, (stream) => {
                let artistID,
                    res = '';
                console.info(`[LOG] Response status: [${stream.statusCode}]`);

                if (stream.statusCode !== 200) {
                    return reject('Received bad response');
                }

                stream.on('data', function (chunk) {
                    res += chunk;
                });

                stream.on('end', function () {
                    res = JSON.parse(res);
                    artistID = res.artists[0].id;
                    console.info(`[LOG] Retrieved id: ${artistID}`);
                    return resolve(artistID || 'Data not formatted as expected');
                });

                return 'Something went wrong, try again';
            });

            req.on('error', (e) => {
                reject(`[ERROR] Problem with request: ${e.message}`);
            });

            req.end();
        })
    }

}