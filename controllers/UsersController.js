import {ObjectID} from 'mongodb';
import DBClient from '../utils/db';
import redisClient from '../utils/redis';

const sha1 = require('sha1');

export default class UsersController {

  static async postNew(req, res) {
    try {
      const {email, password} = req.body;
      if (!email) return res.status(400).send({error: 'Missing email'});
      if (!password) return res.status(400).send({error: 'Missing password'});
      const user = await DBClient.db.collection('users').findOne({email});
      if (user) return res.status(400).send({error: 'Already exist'});
      const hash = sha1(password);
      const result = await DBClient.db.collection('users').insertOne({email, password: hash});
      return res.status(201).send({id: result.insertedId, email});
    } catch (e) {
      return res.status(400).send({error: e.message});
    }
  }


  static async  getMe(req, res) {
    try {
      const token = req.headers['x-token'];
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) return res.status(401).send({error: 'Unauthorized'});
      const user = await DBClient.db.collection('users').findOne({_id: ObjectID(userId), email: req.user.email});
      if (!user) return res.status(401).send({error: 'Unauthorized'});
      delete user.password;
      return res.status(200).send(user);
    } catch (e) {
      return res.status(401).send({error: 'Unauthorized'});
    }
  }
}
