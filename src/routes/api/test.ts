import { MongoClient } from "mongodb";
import { json } from "solid-start/server";
import { saMongoClient } from "../../backend/saMongoClient";

export async function GET() {
  // const uri =
  //   "mongodb+srv://SylvanArchiveAPI:getAPIPass@sylvanarchivedb.zodmskg.mongodb.net/";
  // const client = new MongoClient(uri);

  let connectionStatus = false;

  let data;

  try {
    await saMongoClient().connect();
    const db = saMongoClient().db("sylvanArchiveDB");
    console.log("connected");
    connectionStatus = true;
    const binders = db.collection("binders");
    const cursor = binders.find({});
    const bindersData = await cursor.toArray();
    data = bindersData;
    await saMongoClient().close();
    console.log("Connection closed");
    console.log("returning data");

    // resolve(json(bindersData));
  } catch (err) {
    console.error("Error connecting to database", err);
    const errorData = { error: "error" };
    const data = JSON.stringify(errorData);
    // resolve(json({ error: "No Data" }));
  }

  // const data = await fetch();

  return json(data);
}
