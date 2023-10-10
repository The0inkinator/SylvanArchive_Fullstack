import { useParams } from "solid-start";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import cardListFetcher from "../../../components/cardListPage/cardListFetcher";
import CardListScene from "~/components/cardListPage/cardListScene/CardListScene";
import server$ from "solid-start/server";
import { MongoClient } from "mongodb";
import { createEffect } from "solid-js";
import { useCardListContext } from "~/context/CardListContext";
import { createRouteAction } from "solid-start";
import { getTable } from "../../../backend/databaseCollections/getTable";

export default function cardListPage() {
  const [echoing, echo] = createRouteAction(async (message: string) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    console.log(message);
    return message;
  });

  const pathInput = useParams();
  cardListFetcher(`${pathInput.cardList}`);

  // const getTestData = async () => {
  //   try {
  //     const initData = await fetch("/api/test");
  //     const jsonData = await initData.json();
  //     console.log(jsonData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // getTestData();

  createEffect(async () => {
    console.log(await getTable("binders"));
  });

  return (
    <>
      <FrontPageHeader />
      <CardListScene />
    </>
  );
}
