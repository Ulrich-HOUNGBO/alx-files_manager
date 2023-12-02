
import redisClient from "../utils/redis";


export default class AuthController {
    static getConnect(req, res) {
        try {

            const token = req.headers.authorization;
            if (!token) return res.status(401).send({error: 'Unauthorized'});
            redisClient.get(token, (err, reply) => {
                if (err) throw err;
                if (reply) return res.status(200).send({id: reply});
                return res.status(401).send({error: 'Unauthorized'});
            });
        } catch (e) {
            return res.status(401).send({error: 'Unauthorized'});
        }
    }


    static getDisconnect(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) return res.status(401).send({error: 'Unauthorized'});
            redisClient.del(token, (err, reply) => {
                if (err) throw err;
                if (reply) return res.status(200).send({message: 'OK'});
                return res.status(401).send({error: 'Unauthorized'});
            });
        } catch (e) {
            return res.status(401).send({error: 'Unauthorized'});
        }
    }
}
