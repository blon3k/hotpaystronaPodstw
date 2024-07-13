import path from 'path';
import {fileURLToPath} from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class Utils{

    static randomBytes = async (size) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(size, (e, buffer) => {
                if (e) { reject(reject) }
                resolve(buffer.toString('hex'))
            })
        })
    }

    static getDirName(){
        return __dirname;
    }

}