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

  // try {
  //   await client.connect();
  //   const db = client.db("sylvanArchiveDB");
  //   console.log("connected");
  //   const binders = db.collection("binders");
  //   const cursor = binders.find({});
  //   const bindersData = await cursor.toArray();

  //   await client.close();

  //   console.log("Connection closed");
  //   console.log("returning data");
  //   return json(bindersData);
  // } catch (err) {
  //   console.error("Error connecting to database", err);
  //   const errorData = { error: "error" };
  //   const data = JSON.stringify(errorData);
  //   return json(data);
  // }

  return new Promise((resolve, reject) => {
    resolve(json({ test: "hello" }));
  });
}
