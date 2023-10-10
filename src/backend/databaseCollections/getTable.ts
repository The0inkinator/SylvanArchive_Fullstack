import { createServerAction$ } from "solid-start/server";
import { saMongoClient } from "../saMongoClient";

export async function getTable(table: string) {
  const [mongoData, getMongoData] = createServerAction$(
    async (tableInput: string) => {
      let tableData;
      try {
        await saMongoClient().connect();
        const db = saMongoClient().db("sylvanArchiveDB");
        const tableCollection = db.collection(`${tableInput}`);
        const tableCursor = tableCollection.find({});
        const mongoTableData = await tableCursor.toArray();
        tableData = mongoTableData;
        await saMongoClient().close();
      } catch (err) {
        console.error("Error connecting to database", err);
      }
      return tableData;
    }
  );

  await getMongoData(table);

  return mongoData.result;
}
