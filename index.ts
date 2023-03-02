/*** node hs three ways of handling the sme activity, and these are:
 *  Promise API
 *  Callback API (These should only be used when performance is critical)
 *  Sync API (These should be avoided has it blocks the main thread, only in exceptional cases can it be used, which are needing to read a config berfore performing an activity.)
 */

import { promises as fsPromises, copyFile, copyFileSync } from "fs";
import { join } from 'path';
import Main from './main';

//Promise API
const copyAFile = async() => {
    try {
        await fsPromises.copyFile(join(__dirname, 'main.txt'), join(__dirname, 'copyText.txt'));
    } catch (error) {
        console.error(error)
    }
}

//Callback API
const copyBFile = () => {
    copyFile(join(__dirname, 'copyText.txt'), join(__dirname, 'copyText2.txt'), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File copied!');
        }
    });
}

//Sync API
const copyCFile = () => {
    copyFileSync(join(__dirname, 'copyText.txt'), join(__dirname, 'copyText3.txt'));
}

//class 
new Main();
//main.readFileHandler();