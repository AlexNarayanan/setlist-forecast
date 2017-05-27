'use strict';
import Request from './request';

const request = new Request();

export default class SetlistfmService {

    constructor() {
        this.host = 'api.setlist.fm';
        this.artistSearchEndpoint = '/rest/0.1/search/artists.json?artistName=';
        this.setlistSearchEndpoint = '/rest/0.1/search/setlists.json?artistMbid=';
    }

    // Returns a promise that will return the unique identifier for a given artist
    getMBID(artist) {

        // Set up request options
        const options = {
            host: this.host,
            path: this.artistSearchEndpoint + artist
        };

        console.info(`[LOG] New mbid request submitted for: ${artist}`);
        console.info(`[LOG] Making setlistfm request at: ${options.host}${options.path}`);
        return new Promise((resolve, reject) => {
            request.get(options).then((res) => {
                const mbid = res['artists']['artist'][0]['@mbid'];
                console.info(`[LOG] Retrieved id: ${mbid}`);
                return resolve(mbid || 'Data not formatted as expected');
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // Returns a promise that will return a given page of setlist data for the given artist mbid
    getSetlists(mbid, page = 1, requestTotalPages = false) {
        let itemsPerPage,
            result = {},
            resultSongs = [],
            resultSetlists = [],
            setlists,
            sets,
            songs,
            totalItems,
            tour;

        // Set up request options
        const options = {
            host: this.host,
            path: `${this.setlistSearchEndpoint}${mbid}&p=${page}`
        };

        console.info(`[LOG] New setlist request submitted for: ${mbid}`);
        console.info(`[LOG] Making setlistfm request at: ${options.host}${options.path}`);

        return new Promise((resolve, reject) => {
            request.get(options).then((res) => {

                // Return the total number of pages that can be requested, if desired
                if (requestTotalPages) {
                    itemsPerPage = res['setlists']['@itemsPerPage'] || 1;
                    totalItems = res['setlists']['@total'] || 0;
                    result['totalPages'] = Math.ceil(totalItems / itemsPerPage);
                }

                // Generate a list of unique songs for each tour in the response
                setlists = res['setlists']['setlist'] || [];
                setlists.forEach((setlist) => {
                    tour = {};
                    tour['name'] = setlist['@tour'] || '';
                    sets = setlist['sets']['set'] || [];
                    // Special case when there is only one set, it's serialized as a object instead of array
                    if (sets['song']) {
                        sets = [sets];
                    }
                    sets.forEach((set) => {
                        songs = set['song'] || [];
                        // Same thing when there's only one song
                        if (songs['@name']) {
                            songs = [songs];
                        }
                        songs.forEach((song) => {
                            song = song['@name'];
                            if (!resultSongs.includes(song)) {
                                resultSongs.push(song);
                            }
                        });
                    });

                    console.info(`[LOG] Processed [${resultSongs.length}] songs for tour '${tour['name']}'`);
                    tour['songs'] = resultSongs;
                    resultSetlists.push(tour);
                 });

                result['setlists'] = resultSetlists;
                return resolve(result);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}