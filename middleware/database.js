import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';
const client = new MongoClient('mongodb+srv://danivelezg:niki1234@cluster0.c3dy1.mongodb.net/main?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(client)
async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db('main');
  return next();
}
const middleware = nextConnect();
middleware.use(database);
export default middleware;