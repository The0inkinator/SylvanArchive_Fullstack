import { Show, createSignal, onMount } from "solid-js";
import "./backButtonStyles.css";
import { useStackStateContext } from "../../../context/StackStateContext";
import { useLocation, useNavigate } from "solid-start";

export default function BackButton() {
  const [opacity, setOpacity] = createSignal<number>(0);
  const [stackState, { closeXStacks }]: any = useStackStateContext();
  const location = useLocation();
  const linkTo = useNavigate();

  onMount(() => {
    function makeButtonVisible() {
      setOpacity(100);
    }
    setTimeout(makeButtonVisible, 250);
  });

  function handleClick() {
    const currentRoute = location.pathname.split("/").length - 2;
    const hoveredStack = stackState().hoveredStack;
    const stacksToClose = () => {
      if (hoveredStack === currentRoute) {
        return 1;
      } else {
        return currentRoute - hoveredStack;
      }
    };
    const newLink = location.pathname
      .split("/")
      .slice(0, -stacksToClose())
      .join("/");

    linkTo(newLink, { scroll: false });
  }

  return (
    <Show when={stackState().stackCount > 1}>
      <button
        onClick={() => {
          handleClick();
        }}
        tabIndex={-1}
        classList={{ backButton: true }}
        style={{ opacity: `${opacity()}%` }}
      ></button>
    </Show>
  );
}
