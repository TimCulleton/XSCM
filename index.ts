/**
 * Created by Tim on 17/07/2017.
 */


import {DirService} from "./src/services/directoryServices/getDirContentsService";


DirService.getDirContents("E:\\Anime").then(dirData => {
    console.info(`DIR DATA :D!!`, dirData);
}, (error) => {
    console.error(error);
});