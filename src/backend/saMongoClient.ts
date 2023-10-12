import { MongoClient } from "mongodb";

export function saMongoClient() {
  const uri =
    "mongodb+srv://SylvanArchiveAPI:getAPIPass@sylvanarchivedb.zodmskg.mongodb.net/";
  const client = new MongoClient(uri);
  return client as any;
}
