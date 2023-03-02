import {FileHandle, watch, open, unlink, rename} from 'node:fs/promises';
import { join } from 'node:path';


class Main {
    private watcher:any;
    private CREATE_FILE:string = "create a file";
    private DELETED_FILE:string = "delete the file";
    private APPEND_FILE:string = "add the fie";
    private RENAME_FILE:string = "rename the file";

    constructor () {
        (async() => {
            try {
                this.watcher = watch(join(__dirname, 'file', 'command.txt')); // this is an async generator and iteration
                for await (let event of this.watcher) {
                    console.log(event.eventType);
                    switch (event.eventType) {
                        case 'change':
                            this.readFileHandler();
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }) ();
    }


    public async readFileHandler() {
        //open the file
        const fileHandler =  await open(join(__dirname, 'file', 'command.txt'), 'r');
        // get the file stats
        const {size} = await fileHandler.stat({bigint:false});
        // creating the file options
        const readOptions = {
            buffer:this.createABuffer(size),
            offset:0,
            length:this.createABuffer(size).byteLength,
            position:0
        }

        const readFile = await fileHandler.read(readOptions)
        
        const command = readFile.buffer.toString('utf-8');
        
        // checking if the files includes a particular command
        if(command.includes(this.CREATE_FILE)) {
            const filePath:string = command.substring(this.CREATE_FILE.length + 1);
            await this.create(filePath);
        }

        if(command.includes(this.DELETED_FILE)) {
            const filePath:string = command.substring(this.DELETED_FILE.length + 1);
            await this.delete(filePath);
        }

        if(command.includes(this.RENAME_FILE)) {
            const to = "to";
            const paths:string = command.substring((this.RENAME_FILE.length + 1));
            //console.log(paths);
            
            // after getting the renaming command we split it at the "to"
            const [oldPath, newPath] = paths.split("to");
            //console.log(oldPath.trimEnd(), newPath.trim());
            this.renameFile(oldPath.trimEnd(), newPath.trim()) 
        }

        await fileHandler.close();

    }


    // create a file
    // create a file <path>
    private async create(path:string) {
        let handler:any;
        try {
            handler = await open(join(__dirname,  "file", path), 'r');
        } catch (error) {
            handler = await open(join(__dirname,  "file", path), 'w+');
        } finally {
            handler.close();
        }
    }

    // delete a file
    // delete the file <path>
    private async delete(path:string) {
        try {
            await unlink(join(__dirname, "file", path));
        } catch (error) {
            console.log(error);
        } finally {
        }

    }



    // rename file
    // rename the file <oldPath> to <newPath>
    private async renameFile(oldPath:string, newPath:string) {
        try {
            //  remamaing a file
            return await rename(join(__dirname, "file", oldPath), join(__dirname, "file", newPath));
        } catch (error:any) {
            return console.error(error.message);
        } 
    }


    // append a file
    // append the file <path> <content>
    private async addToFile(path:string, content:string) {

    }

    private createABuffer(bufferSize:number):Buffer {
        return Buffer.alloc(bufferSize);
    }
}


export default Main;