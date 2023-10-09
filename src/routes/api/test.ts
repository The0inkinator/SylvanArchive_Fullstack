import { MongoClient } from "mongodb";
import { json } from "solid-start/server";
import fetch from "../../backend/fetch";

export async function GET() {
  const uri =
    "mongodb+srv://SylvanArchiveAPI:getAPIPass@sylvanarchivedb.zodmskg.mongodb.net/";
  const client = new MongoClient(uri);

  let connectionStatus = false;

  try {
    await client.connect();
    const db = client.db("sylvanArchiveDB");
    console.log("connected");
    connectionStatus = true;
    // const binders = db.collection("binders");
    // const cursor = binders.find({});
    // const bindersData = await cursor.toArray();
    // await client.close();
    // console.log("Connection closed");
    // console.log("returning data");

    // resolve(json(bindersData));
  } catch (err) {
    console.error("Error connecting to database", err);
    const errorData = { error: "error" };
    const data = JSON.stringify(errorData);
    // resolve(json({ error: "No Data" }));
  }

  // const data = await fetch();

  const data = { Status: connectionStatus };

  return json(data);
}
