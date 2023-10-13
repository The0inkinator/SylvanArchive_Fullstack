import { useStackMapContext } from "../../context/StackMapContext";

export default async function buildStackMap() {
  const [stackMap, { makeStackMap }]: any = useStackMapContext();

  try {
    const binderData = await fetch("/api/tables/newBinders");
    const binderJson = await binderData.json();
    makeStackMap(binderJson);
    return "Built";
  } catch (err) {
    console.error("Error fetching stackmap", err);
    return "Failed";
  }
}
