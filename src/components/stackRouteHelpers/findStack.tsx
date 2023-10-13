import { useStackMapContext } from "../../context/StackMapContext";

interface findStackInput {
  stackToFind: string;
}

export default async function findStack(stackToFind: string) {
  interface stackMapEntryInput {
    name: string;
  }
  const [stackMap, { makeStackMap }]: any = useStackMapContext();
  const fullPath = `home/${stackToFind}`;
  const currentStack = () => {
    const eachStack = fullPath.split("/");
    const extraPath = eachStack.length - 2;
    const currentStackName = eachStack.slice(extraPath);
    return `${currentStackName[0]}/${currentStackName[1]}`;
  };
  console.log("checking for stackmap");

  const foundStack = stackMap().filter(
    (stackMapEntry: stackMapEntryInput) => stackMapEntry.name === currentStack()
  );
  console.log("stack map already loaded");
  return foundStack[0];
}
