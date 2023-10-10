import { useParams } from "solid-start";
import { getTable } from "../../../backend/databaseCollections/getTable";
import { json } from "solid-start";

export async function GET() {
  const apiInput = useParams();
  const fetchedTable = await getTable(`${apiInput.table}`);
  return json(fetchedTable);
}
