/**
 * Created by Tim on 17/07/2017.
 */

//forcing git to change..

export interface IDirData {
    root: string;
    files: string[];
    dirs: IDirData[];
}