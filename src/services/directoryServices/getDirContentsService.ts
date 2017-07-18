/**
 * Created by Tim on 15/07/2017.
 */

//forcing git to change..

import {IDirData} from "./dirTypes";

import fs = require("fs");
import path = require("path");

export class DirService {

    public static getDirContents(dir: string, dirData?: IDirData): Promise<IDirData> {

        dirData = dirData || DirService._createDirData();

        return new Promise<IDirData>((resolve, reject) => {

            fs.exists(dir, exists => {
                if(exists) {

                    let pathStat = fs.lstatSync(dir);

                    if(pathStat.isFile()) {
                        dirData.files.push(dir);
                        resolve(dirData);
                    } else if (pathStat.isDirectory()) {

                        fs.readdir(dir, (error, files) => {

                            if(!error) {

                                let childDirData = DirService._createDirData();
                                dirData.dirs.set(dir, childDirData);

                                let promises: Promise<IDirData>[] = [];
                                for(let file of files) {
                                    let childPath = path.resolve(dir, file);
                                    promises.push(DirService.getDirContents(childPath, childDirData));
                                }

                                Promise.all(promises).then(data => {
                                    console.log(data);
                                    resolve(dirData);
                                }, reject);

                            } else {
                                reject(error);
                            }
                        });
                    }
                } else {
                    reject(`Path does not exist: ${dir}`);
                }
            })
        });
    }


    private static _createDirData(): IDirData {
        return {
            files: [],
            dirs: new Map<string, IDirData>()
        };
    }
}