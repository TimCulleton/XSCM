/**
 * Created by Tim on 17/07/2017.
 */

import {DirService} from "./src/services/directoryServices/getDirContentsService";
import {Anime} from "./src/services/animeServices/anime"

DirService.getDirContents("E:\\Anime\\ID-0").then(dirData => {
    console.log(`Data recieved :D`);
    let id0 = new Anime(dirData);

    if(!id0.areEpisodesInKodiFormat()) {
        id0.updateEpisodeNames().then(files => {
            for(let file of files) {
                console.log(`renamed: ${file}`);
            }
        })
    }

    console.log(`Episodes are in Kodi format: ${id0.areEpisodesInKodiFormat()}`);
    return 0;
}, (error) => {
    console.error(error);
});