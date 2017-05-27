'use strict';
import http from 'http';

export default class Request {

    // Promise wrapper for the request method from the http library
    // Takes in options object inherited from the parent function
    get(options) {
        return new Promise((resolve, reject) => {
            const req = http.get(options, (stream) => {
                let res = '';
                console.info(`[LOG] Response status: [${stream.statusCode}]`);

                if (stream.statusCode !== 200) {
                    return reject('Received bad response');
                }

                stream.on('data', function (chunk) {
                    res += chunk;
                });

                stream.on('end', function () {
                    return resolve(JSON.parse(res));
                });
            });

            req.on('error', (err) => {
                reject(`Problem with request: ${err.message}`);
            });

            req.end();
        })
    }

}