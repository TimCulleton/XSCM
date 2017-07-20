import {IAnime} from "./animeTypes"
import {IDirData} from "../directoryServices/dirTypes"

import path = require("path");


const REGEX_VIDEO_CHECK = /\.avi$|\.mkv$|\.mp4$/;
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

        if(dirData.dirs.length === 0) {
            this.seasons.set(Anime.createSeasonName(1), Anime.createEpisodeList(dirData))
        } else {
            dirData.dirs.forEach((season, index) => {
                this.seasons.set(Anime.createSeasonName(index + 1), Anime.createEpisodeList(season));
            })
        }
    }

    areEpisodesInKodiFormat(): boolean {
        return null;
    }

    updateEpisodeNames() {
    }


    private static createSeasonName(seasonNum: number): string {
        return `${SEASON} ${seasonNum}`;
    }

    private static createEpisodeList(season: IDirData): string[] {
        let episodes: string[] = [];

        for(let episode of season.files) {
            if(REGEX_VIDEO_CHECK.test(episode)) {
                episodes.push(path.relative(season.root, episode));
            }
        }

        return episodes;
    }
}