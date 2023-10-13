import { useStackMapContext } from "../../context/StackMapContext";

interface findStackInput {
  stackToFind: string;
}

export default async function findStack2({ stackToFind }: findStackInput) {
  const [stackMap, { makeStackMap }]: any = useStackMapContext();

  if (stackMap()) {
    return "Stackmap Already Exists";
  } else {
    try {
      const binderData = await fetch("/api/tables/newBinders");
      const binderJson = await binderData.json();
      makeStackMap(binderJson);
      return "Stackmap Needed loading";
    } catch (err) {
      console.error("Error fetching stackmap", err);
      return "Stackmap doesn't exist";
    }
  }
}
