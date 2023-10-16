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
import { useStackMapContext } from "../../../context/StackMapContext";
import Stack from "../../../components/shelfSystem/stack/Stack";
import { useStackStateContext } from "../../../context/StackStateContext";
import { useStackDraggingContext } from "../../../context/StackDraggingContext";

export default function stackRoute() {
  const params = useParams();
  const location = useLocation();
  let shelfSceneContainer: HTMLDivElement | null = null;
  let shelfHeight: number;
  const [pastRoute, setPastRoute] = createSignal<string>(params.stackRoute);
  const [stackList, setStackList] = createSignal<any[]>([]);
  const [pageBuilding, setPageBuilding] = createSignal<
    "checkingMap" | "populatingStacks" | "loaded"
  >("checkingMap");
  const [stackMap, { makeStackMap }]: any = useStackMapContext();
  const [
    stackState,
    { setStackCount, setStacksPopulated, setInitialStackPath },
  ]: any = useStackStateContext();
  const [stackDragging, { dragToStill }]: any = useStackDraggingContext();

  onMount(async () => {
    const binderListData = await fetch("/api/tables/newBinders2");
    const binderListJson = await binderListData.json();
    makeStackMap(binderListJson);
    setPageBuilding("populatingStacks");

    const currentRoute = params.stackRoute.split("/");
    const allStackNames = () => {
      return currentRoute.map((routePoint, index) => {
        if (currentRoute[index - 1]) {
          return `${currentRoute[index - 1]}/${routePoint}`;
        } else {
          return `home/${routePoint}`;
        }
      });
    };

    const verifyStacks = async () => {
      return await Promise.all(
        allStackNames().map(async (stackName) => {
          return await findStack(`${stackName}`);
        })
      );
    };

    const verifiedStackList = await verifyStacks();
    const builtStackList = verifiedStackList.map((stackObject, index) => {
      return () => {
        return <Stack stackID={stackObject.name} stackNum={index + 1} />;
      };
    });
    setStackCount(builtStackList.length);
    setInitialStackPath(allStackNames());
    setStacksPopulated(true);
    setStackList(builtStackList);
    setMargins();
  });

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

    const foundStack = stackMap().filter(
      (stackMapEntry: stackMapEntryInput) =>
        stackMapEntry.name === currentStack()
    );
    return foundStack[0];
  }

  function setMargins() {
    if (shelfSceneContainer) {
      shelfHeight =
        shelfSceneContainer.children[0].getBoundingClientRect().height;
      const topMarginCalc: number = (window.innerHeight - shelfHeight) / 2;
      shelfSceneContainer.style.paddingTop = `${topMarginCalc}px`;
      shelfSceneContainer.style.paddingBottom = `${topMarginCalc}px`;
    }
  }

  function newStackList(stackListLength: number) {
    const currentRoute = params.stackRoute.split("/");
    const newStackNames = currentRoute.slice(stackList().length);
    const fullStackObjects = newStackNames.map((stackName, index) => {
      return stackMap().filter(
        (stackMapObject: any) =>
          stackMapObject.name ===
          `${currentRoute[currentRoute.length - 2]}/${stackName}`
      )[0];
    });

    const newStacks = fullStackObjects.map((stackObject, index) => () => {
      const stackNum = stackListLength + index + 1;
      console.log("stack num is:", stackNum);
      return <Stack stackID={`${stackObject.name}`} stackNum={stackNum} />;
    });

    return newStacks;
  }

  function stacksLost() {
    const oldRoute = pastRoute().split("/");

    const currentRoute = params.stackRoute.split("/");

    const numberToRemove = oldRoute.length - currentRoute.length;
    return numberToRemove;
  }

  createEffect(() => {
    if (pastRoute().length < params.stackRoute.length) {
      const newStackCount =
        stackState().stackCount + newStackList(stackList().length).length;
      setStackCount(newStackCount);
      setStackList((prevList) =>
        [...prevList].concat(newStackList(stackList().length))
      );
      setPastRoute(params.stackRoute);
    } else if (pastRoute().length > params.stackRoute.length) {
      const newStackCount = stackList().length - stacksLost();
      const newStackList = stackList().slice(0, -stacksLost());
      setStackCount(newStackCount);
      setStackList(newStackList);
      dragToStill();
      setPastRoute(params.stackRoute);
    }
  });

  return (
    <>
      {/* <Show when={pageBuilding() !== "loaded"} fallback={<></>}>
        <div>{pageBuilding()}</div>
      </Show> */}
      <div
        class={styles.shelfSceneContainer}
        ref={(el) => (shelfSceneContainer = el)}
      >
        <For each={stackList()} fallback={<div>No Array</div>}>
          {(returnedStack) => <div>{returnedStack}</div>}
        </For>
      </div>
    </>
  );
}
