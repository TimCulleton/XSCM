import {IAnime} from "./animeTypes"
import {IDirData} from "../directoryServices/dirTypes"

import path = require("path");

export class Anime implements IAnime {

    constructor(dirData: IDirData) {
        this.name = path.basename(dirData.root);
    }

    name: string;
    seasons: Map<string, IDirData>;
    tvdbId: string;

    areEpisodesInKodiFormat(): boolean {
        return null;
    }

    updateEpisodeNames() {
    }

}