import { useStackMapContext } from "../../context/StackMapContext";
import buildStackMap from "./buildStackMap";

interface stackToFindInput {
  stackToFind: string;
}

interface stackMapEntryInput {
  name: string;
}

export default async function findStack({ stackToFind }: stackToFindInput) {
  const [stackMap]: any = useStackMapContext();
  const fullPath = `home/${stackToFind}`;
  const currentStack = () => {
    const eachStack = fullPath.split("/");
    const extraPath = eachStack.length - 2;
    const currentStackName = eachStack.slice(extraPath);
    return `${currentStackName[0]}/${currentStackName[1]}`;
  };

  console.log("running");

  if (stackMap()) {
    console.log("stackMap exists");
    const foundStack = stackMap().filter(
      (stackMapEntry: stackMapEntryInput) =>
        stackMapEntry.name === currentStack()
    );
    return foundStack[0];
  } else {
    if ((await buildStackMap()) === "Built") {
      const foundStack = stackMap().filter(
        (stackMapEntry: stackMapEntryInput) =>
          stackMapEntry.name === currentStack()
      );
      return foundStack[0];
    } else {
      return "No Stack Found";
    }
  }
}
