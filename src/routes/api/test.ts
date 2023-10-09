import { request } from "http";
import { MongoClient } from "mongodb";
import { json } from "solid-start/server";
const cors = require("cors");

export async function GET() {
  const corsMiddleWare = cors();
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
      console.log("returning data");
      corsMiddleWare(request, () => {
        resolve(json(bindersData));
      });
    } catch (err) {
      console.error("Error connecting to database", err);
      const errorData = { error: "error" };
      const data = JSON.stringify(errorData);
      resolve(json({ error: "No Data" }));
    }
  });
}
