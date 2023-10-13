import { useStackMapContext } from "../../context/StackMapContext";

interface pathToCheckInput {
  pathToCheck: string;
}

export default async function checkStackMap({ pathToCheck }: pathToCheckInput) {
  const [stackMap]: any = useStackMapContext();
}
