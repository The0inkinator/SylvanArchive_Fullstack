import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount, Switch, For } from "solid-js";
import MiniStack from "../../../testComponents/miniStack";
import { A, useIsRouting, useLocation } from "@solidjs/router";

export default function stackRoute() {
  const params = useParams();
  const location = useLocation();
  const [pastRoute, setPastRoute] = createSignal<string>(params.stackRoute);
  const [miniStackList, setMiniStackList] = createSignal<any[]>([]);

  function addStacks() {
    const currentRoute = params.stackRoute.split("/");
    const newStackNames = currentRoute.slice(miniStackList().length);
    const newStacksArray = newStackNames.map((name) => () => {
      return <MiniStack stackName={name} />;
    });
    return newStacksArray;
  }

  function removeStacks() {
    const oldRouteLength = pastRoute().split("/");
    const currentRouteLength = params.stackRoute.split("/");
    const numberToRemove = oldRouteLength.length - currentRouteLength.length;
    return numberToRemove;
  }

  onMount(() => {
    const currentRoute = params.stackRoute.split("/");
    const newStackArray = currentRoute.map((routePoint) => {
      return <MiniStack stackName={routePoint} />;
    });
    setMiniStackList(newStackArray);
  });

  createEffect(() => {
    if (pastRoute() < params.stackRoute) {
      setMiniStackList((prevList) => [...prevList, addStacks()]);
      setPastRoute(params.stackRoute);
    } else if (pastRoute() > params.stackRoute) {
      const newMiniStackList = miniStackList().slice(0, -removeStacks());
      setMiniStackList(newMiniStackList);

      setPastRoute(params.stackRoute);
    }
  });

  return (
    <>
      <div class={styles.textCont}>
        <div>
          <A href={`${params.stackRoute}/nextRoute`}>Navigate To Next</A>
          <div>{location.pathname}</div>
          <For each={miniStackList()} fallback={<div>No Array</div>}>
            {(item) => <div>{item()}</div>}
          </For>
        </div>
      </div>
    </>
  );
}
