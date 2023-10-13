import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  onMount,
  Switch,
  For,
  Show,
} from "solid-js";
import MiniStack from "../../../testComponents/miniStack";
import { A, useIsRouting, useLocation } from "@solidjs/router";
import buildStackMap from "../../../components/stackRouteHelpers/buildStackMap";
import { useStackMapContext } from "../../../context/StackMapContext";
import Stack from "../../../components/shelfSystem/stack/Stack";
import { useStackStateContext } from "../../../context/StackStateContext";

export default function stackRoute() {
  const params = useParams();
  const location = useLocation();
  const [pastRoute, setPastRoute] = createSignal<string>(params.stackRoute);
  const [miniStackList, setMiniStackList] = createSignal<any[]>([]);
  const [stackList, setStackList] = createSignal<any[]>([]);
  const [pageBuilding, setPageBuilding] = createSignal<
    "checkingMap" | "populatingStacks" | "loaded"
  >("checkingMap");
  const [stackMap, { makeStackMap }]: any = useStackMapContext();
  const [
    stackState,
    { loadStack, closeXStacks, addToStackCount, updateStackMapLoadStatus },
  ]: any = useStackStateContext();

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

  async function checkStackMap() {
    if (!stackMap()) {
      await buildStackMap();
    }
  }

  async function findStack(stackToFind: string) {
    interface stackMapEntryInput {
      name: string;
    }

    const fullPath = `home/${stackToFind}`;
    const currentStack = () => {
      const eachStack = fullPath.split("/");
      const extraPath = eachStack.length - 2;
      const currentStackName = eachStack.slice(extraPath);
      return `${currentStackName[0]}/${currentStackName[1]}`;
    };

    const foundStack = stackMap().stackList.filter(
      (stackMapEntry: stackMapEntryInput) =>
        stackMapEntry.name === currentStack()
    );
    return foundStack[0];
  }

  onMount(async () => {
    await checkStackMap();
    updateStackMapLoadStatus(true);
    setPageBuilding("populatingStacks");

    const currentRoute = params.stackRoute.split("/");
    const currentStackNameList = () => {
      return currentRoute.map((routePoint, index) => {
        if (currentRoute[index - 1]) {
          return `${currentRoute[index - 1]}/${routePoint}`;
        } else {
          return `home/${routePoint}`;
        }
      });
    };
    const startingStackList = async () => {
      return await Promise.all(
        currentStackNameList().map(async (stackName) => {
          return await findStack(`${stackName}`);
        })
      );
    };

    const stackObjectList = await startingStackList();
    const stackElementArray = stackObjectList.map((stackObject, index) => {
      return () => {
        return <Stack stackID={stackObject.name} stackNum={index} />;
      };
    });
    setStackList(stackElementArray);
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
          <Show when={pageBuilding() !== "loaded"} fallback={<></>}>
            <div>{pageBuilding()}</div>
          </Show>
          <A href={`${params.stackRoute}/nextRoute`}>Navigate To Next</A>
          <div>{location.pathname}</div>
          <For each={stackList()} fallback={<div>No Array</div>}>
            {(item) => <div>{item()}</div>}
          </For>
        </div>
      </div>
    </>
  );
}
