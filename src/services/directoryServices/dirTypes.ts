/**
 * Created by Tim on 17/07/2017.
 */

export interface IDirData {
    files: string[];
    dirs: Map<string, IDirData>
}