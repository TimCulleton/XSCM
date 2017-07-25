import {IAnime} from "./animeTypes"
import {IDirData} from "../directoryServices/dirTypes"

import path = require("path");
import fs = require("fs");


const REGEX_VIDEO_CHECK = /\.avi$|\.mkv$|\.mp4$/;
//Tests normal format '1x01' and S0E01 format
const REGEX_KODI_FORMAT = /^\d+x\d+|S\d+E\d+/;
const REGEX_EXTRACT_EP_NUM = /\s(\d+)\s|_(\d+)_|-\s(\d+)/;
const SEASON = "Season";
const TV_SHOW_NFO = "tvshow.nfo";


export class Anime implements IAnime {

    name: string;
    seasons: Map<string, string[]>;
    tvdbId: string;
    private rootPath: string;


    constructor(dirData: IDirData) {
        this.name = path.basename(dirData.root);
        this.rootPath = dirData.root;
        this.seasons = new Map<string, string[]>();

        if(dirData.dirs.length === 0) {
            let movedFiles = this.moveFilesToSeason(1, Anime.createEpisodeList(dirData));
            this.seasons.set(Anime.createSeasonName(1), movedFiles)
        } else {
            dirData.dirs.forEach((season, index) => {
                this.seasons.set(Anime.createSeasonName(index + 1), Anime.createEpisodeList(season));
            })
        }
    }

    areEpisodesInKodiFormat(): boolean {
        let kodiFormat = true;
        for(let season of this.seasons.values()) {
            for(let episode of season) {
                if(!REGEX_KODI_FORMAT.test(episode)) {
                    return false;
                }
            }
        }
        return kodiFormat;
    }

    /**
     * Updates the anime collection prefxing the files with a season/episode tag
     * to assist in kodi scraping the meta data.
     *
     * This will return a promise containing a collection files that have been updated.
     * @async
     * @returns {Promise<string[]>}
     */
    updateEpisodeNames(): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            if(!this.areEpisodesInKodiFormat()) {
                let seasonNum = 0;
                let promises = [];
                for(let [seasonPath, files] of this.seasons.entries()) {
                    ++seasonNum;

                    for(let file of files) {
                        let episode = path.basename(file);
                        if(!REGEX_KODI_FORMAT.test(episode)) {
                            let candidates = REGEX_EXTRACT_EP_NUM.exec(episode);
                            let epNum: number = null;
                            for(let canidate of candidates) {
                                epNum = parseInt(canidate, 10);

                                if(!isNaN(epNum)) {
                                    break;
                                }
                            }

                            if(!isNaN(epNum)) {
                                promises.push(new Promise<string>((resolve, reject) => {
                                    let newPath = path.resolve(this.rootPath, seasonPath, Anime.createEpisodePrefix(seasonNum, epNum) + episode);
                                    fs.rename(file, newPath, (err => {
                                        if(err) {
                                            reject(err);
                                        } else {
                                            resolve(newPath);
                                        }
                                    }));
                                }));
                            }
                        }
                    }
                }

                Promise.all(promises).then(files => {
                    resolve(files);
                }, reject);
            }
            resolve([]);
        });
    }

    /**
     * Moves a collection of files to a season folder.
     * This will block while this action is performed to allow it it be called during the constructor
     * @param {number} seasonNum
     * @param {string[]} files
     * @returns {string[]}
     */
    private moveFilesToSeason(seasonNum: number, files: string[]): string[] {
        let movedFiles = [];
        let seasonPath = path.resolve(this.rootPath, Anime.createSeasonName(seasonNum));
        if(!fs.existsSync(seasonPath)) {
            fs.mkdirSync(seasonPath);
        }

        for(let file of files) {
            let newPath = path.resolve(seasonPath, path.basename(file));
            fs.renameSync(file, newPath);
            movedFiles.push(newPath);
        }
        return movedFiles;
    }

    /**
     * Create a Kodi/tvdb compliant prefix: 1x05_
     *                                    season x ep num
     * @param {number} seasonNum
     * @param {number} episodeNum
     * @returns {string}
     */
    private static createEpisodePrefix(seasonNum: number, episodeNum: number): string {
        return `${seasonNum}x${Anime.padNumber(episodeNum)}_`
    }

    /**
     * Pads the number with a number of leading zeros
     * @param {number} num
     * @param {number} padding
     * @returns {string}
     */
    private static padNumber(num: number, padding = 2): string {
        let padString = "" + num;
        while (padString.length < padding) {
            padString = "0" + padString;
        }
        return padString;
    }

    /**
     * Create a season folder name.
     * @param {number} seasonNum
     * @returns {string}
     */
    private static createSeasonName(seasonNum: number): string {
        return `${SEASON} ${seasonNum}`;
    }

    private static createEpisodeList(season: IDirData): string[] {
        let episodes: string[] = [];

        for(let episode of season.files) {
            if(REGEX_VIDEO_CHECK.test(episode)) {
                episodes.push(path.resolve(season.root, episode));
            }
        }

        return episodes;
    }
}