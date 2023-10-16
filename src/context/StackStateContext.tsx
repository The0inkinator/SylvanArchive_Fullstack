import { createSignal, createContext, useContext } from "solid-js";

const StackStateContext = createContext();

interface stackInfo {
  activeStack: any;
  stackCount: number;
  stacksPopulated: boolean;
  hoveredStack: number;
  initialStackPath: string | null;
  popStateTriggered: boolean;
}

export function StackStateProvider(props: any) {
  const [stackState, setStackState] = createSignal<stackInfo>({
      activeStack: null,
      stackCount: 1,
      stacksPopulated: false,
      hoveredStack: 1,
      initialStackPath: null,
      popStateTriggered: false,
    }),
    stackStateList = [
      stackState,
      {
        changeActiveStack(input: any) {
          setStackState((prevState) => ({
            ...prevState,
            activeStack: input,
          }));
        },
        setStackCount(inputNumber: number) {
          setStackState((prevState) => ({
            ...prevState,
            stackCount: inputNumber,
          }));
        },
        setStacksPopulated(input: boolean) {
          setStackState((prevState) => ({
            ...prevState,
            stacksPopulated: input,
          }));
        },
        setHoveredStack(inputNumber: number) {
          setStackState((prevState) => ({
            ...prevState,
            hoveredStack: inputNumber,
          }));
        },
        setInitialStackPath(inputPath: string) {
          setStackState((prevState) => ({
            ...prevState,
            initialStackPath: inputPath,
          }));
        },
        setPopState(input: boolean) {
          setStackState((prevState) => ({
            ...prevState,
            popStateTriggered: input,
          }));
        },
      },
    ];

  return (
    <StackStateContext.Provider value={stackStateList}>
      {props.children}
    </StackStateContext.Provider>
  );
}

export function useStackStateContext() {
  return useContext(StackStateContext);
}
