import AuthController from "./AuthController";
import { ObjectID } from 'mongodb';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';

import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import readFile from '../utils/read';
import writeFile from '../utils/write';
import fileQueue from '../worker';


export default class FilesController {

    static async postUpload(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const user = await AuthController.getMe(token);
        if (!user) return res.status(401).json({message: 'Unauthorized'});

        const {name, type, parentId, isPublic, data} = req.body;
        if (!name) return res.status(400).json({message: 'Missing name'});
        if (!type || !['folder', 'file', 'image'].includes(type)) return res.status(400).json({message: 'Missing type'});
        if (!data && type !== 'folder') return res.status(400).json({message: 'Missing data'});
        if (parentId) {
            const parent = await FilesController.getFile(parentId);
            if (!parent) return res.status(400).json({message: 'Parent not found'});
            if (parent.type !== 'folder') return res.status(400).json({message: 'Parent is not a folder'});
        }
        const file = {
            userId: user._id,
            name,
            type,
            isPublic: isPublic || false,
            parentId: parentId || 0,
            localPath: null
        };
        if (type !== 'folder') {
            file.data = data;
            file.path = await writeFile(file);
        }

        const newFile = dbClient.uploadFile(file);

        if (type === 'image') {
            await fileQueue.add(newFile);
        }

        newFile.id = newFile._id;
        delete newFile._id;
        delete newFile.data;
        delete newFile.path;

        return res.json(newFile);

    }
}

