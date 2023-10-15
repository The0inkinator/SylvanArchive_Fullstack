import { createSignal, createContext, useContext } from "solid-js";

const StackStateContext = createContext();

interface stackInfo {
  activeStack: any;
  stackCount: number;
  stackMapLoaded: boolean;
  stacksPopulated: boolean;
  hoveredStack: number;
}

export function StackStateProvider(props: any) {
  const [stackState, setStackState] = createSignal<stackInfo>({
      activeStack: null,
      stackCount: 1,
      stackMapLoaded: false,
      stacksPopulated: false,
      hoveredStack: 1,
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
        updateStackMapLoadStatus(input: boolean) {
          setStackState((prevState) => ({
            ...prevState,
            stackMapLoaded: input,
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
