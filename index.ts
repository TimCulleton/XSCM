/**
 * Created by Tim on 17/07/2017.
 */

import {DirService} from "./src/services/directoryServices/getDirContentsService";
import {Anime} from "./src/services/animeServices/anime"

DirService.getDirContents("E:\\Anime\\Mondaiji-tachi ga Isekai kara Kuru Sou Desu yo").then(dirData => {
    console.log(`Data recieved :D`);
    let anime = new Anime(dirData);

    if(!anime.areEpisodesInKodiFormat()) {
        anime.updateEpisodeNames().then(files => {
            for(let file of files) {
                console.log(`renamed: ${file}`);
            }
        })
    }

    console.log(`Episodes are in Kodi format: ${anime.areEpisodesInKodiFormat()}`);
    return 0;
}, (error) => {
    console.error(error);
});