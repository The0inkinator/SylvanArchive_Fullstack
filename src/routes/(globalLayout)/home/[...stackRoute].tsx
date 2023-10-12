import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount, Switch, For } from "solid-js";
import MiniStack from "../../../testComponents/miniStack";

export default function stackRoute() {
  const [pageState, setPageState] = createSignal<
    "loading" | "error" | "loaded"
  >("loading");
  const params = useParams();
  const route = params.stackRoute.split("/");

  return (
    <>
      <div class={styles.textCont}>
        <div>
          <a href={`${params.stackRoute}/nextRoute`}>Navigate To Next</a>
          <For each={route} fallback={<div>No Array</div>}>
            {(item) => <MiniStack stackName={item} />}
          </For>
        </div>
      </div>
    </>
  );
}
