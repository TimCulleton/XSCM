/**
 * Created by Tim on 17/07/2017.
 */

//forcing git to change..

export interface IDirData {
    files: string[];
    dirs: Map<string, IDirData>
}