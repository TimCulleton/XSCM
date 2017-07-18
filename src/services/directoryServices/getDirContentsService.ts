/**
 * Created by Tim on 15/07/2017.
 */

//forcing git to change..

import {IDirData} from "./dirTypes";

import fs = require("fs");
import path = require("path");

export class DirService {

    /**
     * Fetch all the contents of the specified dir path. This will recursively drill down
     * till the path is exhausted.
     * @param {string} dirPath
     * @returns {Promise<IDirData>}
     */
    public static getDirContents(dirPath: string): Promise<IDirData> {

        return new Promise<IDirData>((resolve, reject) => {
            if (fs.existsSync(dirPath)) {

                let dirData = DirService.createDirData(dirPath);
                let dirStats = fs.lstatSync(dirPath);

                if (dirStats.isDirectory()) {

                    fs.readdir(dirPath, (err, files) => {

                        let promises: Promise<IDirData>[] = [];

                        for (let file of files) {
                            let childPath = path.resolve(dirPath, file);
                            let childStat = fs.lstatSync(childPath);

                            //Wrap all the directory fetches to get a promise all
                            if (childStat.isDirectory()) {
                                //Drill down to get the contents
                                promises.push(DirService.getDirContents(childPath));
                            } else {
                                dirData.files.push(file);
                            }
                        }

                        //Once all the children have been fetched add the data to the current level
                        Promise.all(promises).then(dirContents => {

                            for (let dirContent of dirContents) {
                                dirData.dirs.push(dirContent);
                            }

                            resolve(dirData);
                        }, reject);
                    })

                    //Realistically should not be hit...
                } else if (dirStats.isFile()) {
                    dirData.files.push(dirPath);
                    resolve(dirData);
                }

            } else {
                reject(`Path does not exist: ${dirPath}`);
            }
        });
    }

    /**
     * Create a simple dir data object
     * @param {string} root
     * @returns {IDirData}
     */
    private static createDirData(root: string): IDirData {
        return {
            root: root,
            files: [],
            dirs: []
        }
    }
}