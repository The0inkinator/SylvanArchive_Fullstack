import { useParams } from "solid-start";
import { Show, For, createSignal } from "solid-js";
import styles from "../../../layouts/cardLists.module.css";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import cardListFetcher from "../../../components/cardListPage/cardListFetcher";

export default function cardListPage() {
  const pathInput = useParams();
  const [pageBuilding, setPageBuilding] = createSignal<
    "checkingMap" | "populatingStack" | "errorLoading" | "stacksLoaded"
  >("checkingMap");
  const [cardList, setCardList] = createSignal<any[]>([]);
  cardListFetcher(`${pathInput.cardList}`);

  return (
    <>
      <FrontPageHeader />
      <Show
        when={pageBuilding() === "stacksLoaded"}
        fallback={<div style={styles.loadingTextBox}></div>}
      >
        <For each={cardList()} fallback={<div>No Array</div>}>
          {(returnedStack) => <div>{returnedStack}</div>}
        </For>
      </Show>
    </>
  );
}
