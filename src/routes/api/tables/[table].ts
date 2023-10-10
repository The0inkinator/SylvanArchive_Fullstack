import { getTable } from "../../../backend/databaseCollections/getTable";
import { type APIEvent, json } from "solid-start";

export async function GET({ params }: APIEvent) {
  console.log("HELLO!");
  const fetchedTable = await getTable(`"${params.table}"`);
  return json(fetchedTable);
}
