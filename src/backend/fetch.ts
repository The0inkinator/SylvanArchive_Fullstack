import { MongoClient } from "mongodb";

export default async function fetch() {
  const uri =
    "mongodb+srv://SylvanArchiveAPI:getAPIPass@sylvanarchivedb.zodmskg.mongodb.net/";
  const client = new MongoClient(uri);

  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const db = client.db("sylvanArchiveDB");
      console.log("connected");
      const binders = db.collection("binders");
      const cursor = binders.find({});
      const bindersData = await cursor.toArray();
      await client.close();
      console.log("Connection closed");
      console.log("Server is returning data");

      resolve(bindersData);
    } catch (err) {
      console.error("Error connecting to database", err);
      const errorData = { error: "error" };
      resolve(errorData);
    }
  });
}
