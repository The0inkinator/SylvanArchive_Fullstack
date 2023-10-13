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
import { A, useIsRouting, useLocation } from "@solidjs/router";
import buildStackMap from "../../../components/stackRouteHelpers/buildStackMap";
import { useStackMapContext } from "../../../context/StackMapContext";
import Stack from "../../../components/shelfSystem/stack/Stack";
import { useStackStateContext } from "../../../context/StackStateContext";

export default function stackRoute() {
  const params = useParams();
  const location = useLocation();
  const [pastRoute, setPastRoute] = createSignal<string>(params.stackRoute);
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
    const newStackNames = currentRoute.slice(stackList().length);
    const convertedStackNames = newStackNames.map((stackName, index) => {
      console.log(currentRoute);
      return `${currentRoute[currentRoute.length - 2]}/${stackName}`;
    });
    console.log(convertedStackNames);
    const newStacksArray = convertedStackNames.map((name, index) => () => {
      const stackNum = stackList.length + index + 1;
      return <Stack stackID={`${name}`} stackNum={stackNum} />;
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
      setStackList((prevList) => [...prevList, addStacks()]);
      setPastRoute(params.stackRoute);
    } else if (pastRoute() > params.stackRoute) {
      const newStackList = stackList().slice(0, -removeStacks());
      setStackList(newStackList);

      setPastRoute(params.stackRoute);
    }
  });

  return (
    <>
      <Show when={pageBuilding() !== "loaded"} fallback={<></>}>
        <div>{pageBuilding()}</div>
      </Show>
      <A href={`${params.stackRoute}/nextRoute`}>Navigate To Next</A>
      <div class={styles.shelfSceneContainer}>
        <div>
          <For each={stackList()} fallback={<div>No Array</div>}>
            {(item) => <div>{item()}</div>}
          </For>
        </div>
      </div>
    </>
  );
}
