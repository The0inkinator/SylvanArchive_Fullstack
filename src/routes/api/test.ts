import server$ from "solid-start/server";
import { createRouteAction } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { MongoClient } from "mongodb";
import { createEffect } from "solid-js";
import { json } from "solid-start/server";

export async function GET() {
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
      resolve(json(bindersData));
    } catch (err) {
      console.error("Error connecting to database", err);
      const errorData = { error: "error" };
      const data = JSON.stringify(errorData);
      resolve(json({ error: "No Data" }));
    }
  });
}
