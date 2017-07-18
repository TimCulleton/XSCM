import {IDirData} from "../directoryServices/dirTypes";

export interface IAnime {
    name: string;
    seasons: Map<string, IDirData>;

    tvdbId: string;
    areEpisodesInKodiFormat(): boolean;
    updateEpisodeNames();
}