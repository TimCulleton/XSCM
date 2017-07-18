/**
 * Created by Tim on 17/07/2017.
 */

import {DirService} from "./src/services/directoryServices/getDirContentsService";

DirService.getDirContents("E:\\Anime").then(dirData => {
    console.log(`Data recieved :D`);
    return 0;
}, (error) => {
    console.error(error);
});