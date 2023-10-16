import { useParams } from "solid-start";
import { Show, For, createSignal, onMount } from "solid-js";
import styles from "../../../layouts/cardLists.module.css";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import cardListFetcher from "../../../components/cardListPage/cardListFetcher";
import Card from "../../../components/cardListPage/card/Card";
import { useCardListContext } from "../../../context/CardListContext";
import { useStackMapContext } from "../../../context/StackMapContext";

export default function cardListPage() {
  const pathInput = useParams();
  const [pageBuilding, setPageBuilding] = createSignal<
    | "checkingMap"
    | "findingCards"
    | "populatingCardlist"
    | "errorLoading"
    | "cardsLoaded"
  >("cardsLoaded");
  const [cardList, { makeCardList }]: any = useCardListContext();
  const [localCardList, setLocalCardList] = createSignal<any[]>([]);
  const [stackMap, { makeStackMap }]: any = useStackMapContext();

  onMount(async () => {
    const cardListPath = pathInput.cardList.split("/");
    const thisCardList = cardListPath.slice(cardListPath.length - 2).join("/");

    const binderListData = await fetch("/api/tables/binders");
    const binderListJson = await binderListData.json();
    makeStackMap(binderListJson);

    const fullCardListData = await fetch("/api/tables/cardsInArchive");
    const fullCardListJson = await fullCardListData.json();
    makeCardList(fullCardListJson);

    cardList().map((card: any) => {
      if (card.cardLists.includes(thisCardList)) {
        setLocalCardList((prevList) => [...prevList, card.name]);
      }
    });

    console.log(localCardList());
  });

  return (
    <>
      <FrontPageHeader />
      <Show
        when={pageBuilding() === "cardsLoaded"}
        fallback={<div style={styles.loadingTextBox}>Loading</div>}
      >
        <div class={styles.sceneContainer}>
          <div class={styles.cardListContainer}>
            <For each={localCardList()} fallback={<div>No Array</div>}>
              {(card) => <Card image={card} />}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
}
