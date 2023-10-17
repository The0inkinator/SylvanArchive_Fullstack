import { useParams } from "solid-start";
import { Show, For, createSignal, createEffect, onMount } from "solid-js";
import styles from "../../../layouts/cardLists.module.css";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import Card from "../../../components/cardListPage/card/Card";
import { useCardListContext } from "../../../context/CardListContext";
import { useStackMapContext } from "../../../context/StackMapContext";

export default function cardListPage() {
  let loadingTextBox: HTMLDivElement | null = null;
  const pathInput = useParams();
  const [pageBuilding, setPageBuilding] = createSignal<
    | "checkingMap"
    | "findingCards"
    | "populatingCardList"
    | "errorLoading"
    | "cardsLoaded"
  >("checkingMap");
  const [cardList, { makeCardList }]: any = useCardListContext();
  const [localCardList, setLocalCardList] = createSignal<any[]>([]);
  const [stackMap, { makeStackMap }]: any = useStackMapContext();

  onMount(async () => {
    if (loadingTextBox) {
      const height = loadingTextBox.getBoundingClientRect().height;
      loadingTextBox.style.setProperty("--JS_loadingTextHeight", `${height}px`);
    }

    const cardListPath = pathInput.cardList.split("/");
    const thisCardList = cardListPath.slice(cardListPath.length - 2).join("/");

    const binderListData = await fetch("/api/tables/binders");
    const binderListJson = await binderListData.json();
    makeStackMap(binderListJson);
    setPageBuilding("findingCards");

    const fullCardListData = await fetch("/api/tables/cardsInArchive");
    const fullCardListJson = await fullCardListData.json();
    makeCardList(fullCardListJson);
    setPageBuilding("populatingCardList");
    cardList().map((card: any) => {
      if (card.cardLists.includes(thisCardList)) {
        setLocalCardList((prevList) => [...prevList, card.name]);
      }
    });

    setPageBuilding("cardsLoaded");
  });

  const [loadingText, setLoadingText] = createSignal<string>("");
  createEffect(() => {
    if (pageBuilding() === "checkingMap") {
      setLoadingText("Checking Stack Map");
    } else if (pageBuilding() === "errorLoading") {
      setLoadingText("Error Loading Data");
    } else if (pageBuilding() === "findingCards") {
      setLoadingText("Finding Cards");
    } else if (pageBuilding() === "populatingCardList") {
      setLoadingText("Populating Card List");
    }
  });

  return (
    <>
      <FrontPageHeader />
      <Show
        when={pageBuilding() === "cardsLoaded"}
        fallback={
          <div
            ref={(el) => {
              loadingTextBox = el;
            }}
            class={styles.loadingTextBox}
          >
            <div class={styles.loadingText}>{loadingText()}</div>
          </div>
        }
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
