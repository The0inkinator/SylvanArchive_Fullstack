import { useParams } from "solid-start";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import cardListFetcher from "../../../components/cardListPage/cardListFetcher";
import CardListScene from "~/components/cardListPage/cardListScene/CardListScene";
import server$ from "solid-start/server";
import { MongoClient } from "mongodb";
import { createEffect } from "solid-js";
import { useCardListContext } from "~/context/CardListContext";
import { createRouteAction } from "solid-start";
import { rejects } from "assert";
import { createServerAction$ } from "solid-start/server";
import { json } from "stream/consumers";

export default function cardListPage() {
  const [echoing, echo] = createRouteAction(async (message: string) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    console.log(message);
    return message;
  });

  const pathInput = useParams();
  cardListFetcher(`${pathInput.cardList}`);

  const [mongoData, getMongoData] = createServerAction$(async () => {
    const uri =
      "mongodb+srv://SylvanArchiveAPI:getAPIPass@sylvanarchivedb.zodmskg.mongodb.net/";
    const client = new MongoClient(uri);
    let data: any;
    try {
      await client.connect();
      const db = client.db("sylvanArchiveDB");
      console.log("connected");
      const binders = db.collection("binders");
      const cursor = binders.find({});
      const bindersData = await cursor.toArray();
      data = bindersData;
      await client.close();
      console.log("Connection closed");
    } catch (err) {
      console.error("Error connecting to database", err);
    }
    console.log(data);
    return data;
  });

  // getMongoData();

  const getTestData = async () => {
    try {
      const initData = await fetch("http://localhost:3000/api/test");
      const jsonData = await initData.json();
      console.log(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  getTestData();

  // createEffect(() => {
  //   console.log(mongoData.result);
  // });

  return (
    <>
      <FrontPageHeader />
      <CardListScene />
    </>
  );
}
