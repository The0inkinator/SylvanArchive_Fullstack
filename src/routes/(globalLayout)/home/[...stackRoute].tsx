import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { useStackMapContext } from "../../../context/StackMapContext";
import Stack from "../../../components/shelfSystem/stack/Stack";
import BackButton from "../../../components/shelfSystem/backButton/BackButton";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import { useStackStateContext } from "../../../context/StackStateContext";
import { useStackDraggingContext } from "../../../context/StackDraggingContext";
import { error } from "console";
import { useNavigate } from "solid-start";

export default function stackRoute() {
  const params = useParams();
  const location = useLocation();
  const linkTo = useNavigate();
  let shelfSceneContainer: HTMLDivElement | null = null;
  let shelfHeight: number;
  const [pastRoute, setPastRoute] = createSignal<string>(params.stackRoute);
  const [stackList, setStackList] = createSignal<any[]>([]);
  const [dots, setDots] = createSignal<string>(".");
  const [pageBuilding, setPageBuilding] = createSignal<
    "checkingMap" | "populatingStack" | "errorLoading" | "stacksLoaded"
  >("checkingMap");
  const [stackMap, { makeStackMap }]: any = useStackMapContext();
  const [
    stackState,
    { setStackCount, setStacksPopulated, setInitialStackPath },
  ]: any = useStackStateContext();
  const [stackDragging, { dragToStill }]: any = useStackDraggingContext();

  onMount(async () => {
    setMargins();
    const binderListData = await fetch("/api/tables/newBinders2");
    const binderListJson = await binderListData.json();
    makeStackMap(binderListJson);
    setPageBuilding("populatingStack");

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
    verifiedStackList.map((stack) => {
      if (!stack) {
        function handleError() {
          setPageBuilding("errorLoading");
          setTimeout(() => {
            linkTo("/404");
          }, 1500);
        }
        throw handleError();
      }
    });
    const builtStackList = verifiedStackList.map((stackObject, index) => {
      return () => {
        return <Stack stackID={stackObject.name} stackNum={index + 1} />;
      };
    });
    setStackCount(builtStackList.length);
    setInitialStackPath(allStackNames());
    setStacksPopulated(true);
    setStackList(builtStackList);
    setPageBuilding("stacksLoaded");
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
      let scrolling: boolean = true;
      let scrollingCheck: any;

      function manageScrolling() {
        clearTimeout(scrollingCheck);
        scrollingCheck = setTimeout(() => {
          scrolling = false;
          if (shelfSceneContainer) {
            shelfSceneContainer.style.transition = "padding 0.05s";
            shelfSceneContainer.style.paddingBottom = `${currentBottomMargin}px`;
          }
          window.removeEventListener("scroll", manageScrolling);
        }, 1);
      }

      setTimeout(() => {
        window.addEventListener("scroll", manageScrolling);
      }, 200);

      const currentBottomMargin = parseInt(
        shelfSceneContainer?.style.paddingBottom as string
      );

      if (shelfSceneContainer) {
        shelfSceneContainer.style.transition = "padding 0s";
        shelfSceneContainer.style.paddingBottom = `${
          currentBottomMargin + shelfHeight
        }px`;
      }

      const newStackCount = stackList().length - stacksLost();
      const newStackList = stackList().slice(0, -stacksLost());
      setStackCount(newStackCount);
      setStackList(newStackList);
      dragToStill();
      setPastRoute(params.stackRoute);
    }
  });

  createEffect(() => {
    if (pageBuilding() !== "stacksLoaded") {
      let dots = 2;
      function loop() {
        if (dots === 1) {
          dots = 2;
          setTimeout(loop, 300);
          setDots(".");
        } else if (dots === 2) {
          dots = 3;
          setTimeout(loop, 300);
          setDots("..");
        } else if (dots === 3) {
          dots = 1;
          setTimeout(loop, 300);
          setDots("...");
        }
      }
      loop();
    }
  });

  const [loadingText, setLoadingText] = createSignal<string>("");
  createEffect(() => {
    if (pageBuilding() === "checkingMap") {
      setLoadingText("Checking Stack Map");
    } else if (pageBuilding() === "errorLoading") {
      setLoadingText("Error Loading Data!");
    } else if (pageBuilding() === "populatingStack") {
      setLoadingText("Populating Stacks");
    }
  });

  return (
    <>
      <FrontPageHeader />
      <BackButton />
      <div
        class={styles.shelfSceneContainer}
        ref={(el) => (shelfSceneContainer = el)}
      >
        <Show
          when={pageBuilding() === "stacksLoaded"}
          fallback={
            <div style={styles.loadingTextBox}>
              <div class={styles.loadingText}>
                {loadingText()}
                {dots()}
              </div>
            </div>
          }
        >
          <For each={stackList()} fallback={<div>No Array</div>}>
            {(returnedStack) => <div>{returnedStack}</div>}
          </For>
        </Show>
      </div>
    </>
  );
}
