'user strict';

import SetlistfmService from '../services/setlistfm';

const setlistfmService = new SetlistfmService();

export default class Artist {

    constructor() {
        this.mbid = '';
        this.tours = [];
        this.songs = [];
    }

    // Gets the mbid and other information of an artist given a name
    // Returns a promise since the data fetching is async
    populateData(name) {
        return new Promise((resolve, reject) => {
            this.populateMbid(name).then(() => {
                this.populateSongs().then(() => {
                    console.info('[LOG] ALL DONE');
                    return resolve(this.mbid);
                }).catch((err) => {
                    return reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // Wrapper for setlistfm.getMbid
    populateMbid(name) {
        return new Promise((resolve, reject) => {
            setlistfmService.getMBID(name).then((mbid) => {
                this.mbid = mbid;
                return resolve();
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // Wrapper for setlistfm.getSetlists
    populateSongs() {
        return new Promise((resolve, reject) => {
            setlistfmService.getSetlists(this.mbid).then((res) => {
                return resolve();
            }).catch((err) => {
                return reject(err);
            });
        });
    }

}