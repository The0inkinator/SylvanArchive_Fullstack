import { useCardListContext } from "~/context/CardListContext";

export default async function cardListFetcher(cardListPath: string) {
  const [cardList, { makeCardList }]: any = useCardListContext();
  try {
    const cardListData = await fetch("/api/tables/cardLists");
    const tempCardList = await cardListData.json();

    interface cardInfo {
      card: string;
      lists: string[];
    }

    const finalList = await tempCardList.filter((card: cardInfo) =>
      card.lists.includes(cardListPath)
    );

    makeCardList(finalList);
  } catch (err) {
    console.log(err);
  }
}
