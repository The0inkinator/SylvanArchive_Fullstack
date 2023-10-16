import { saMongoClient } from "../saMongoClient";

export async function getTable(table: string) {
  const mongoClient: any = saMongoClient();
  let tableData = ["no data found"];
  try {
    await mongoClient.connect();
    const db = mongoClient.db("sylvanArchiveDB");
    const tableCollection = db.collection(`${table}`);
    const tableCursor = tableCollection.find({});
    const mongoTableData = await tableCursor.toArray();
    tableData = mongoTableData;
  } catch (err) {
    console.error("Error connecting to database", err);
  } finally {
    await mongoClient.close();
  }
  return tableData;
}
