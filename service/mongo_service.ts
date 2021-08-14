import { connectToDatabase } from "..";
import { Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
export class MongoService {
  private db!: Db;
  private async connectToDb() {
    this.db = await connectToDatabase(MONGODB_URI);
  }
  async writeToMongoDb(collectionName: string, data: any, condition: any) {
    try {
      if (!this.db) {
        await this.connectToDb();
      }
      console.log(this.db.databaseName);
      const bulk = this.db
        .collection(collectionName)
        .initializeUnorderedBulkOp();
      bulk.find(condition).upsert().replaceOne(data);
      const p = await bulk?.execute();
      console.log("BULK EXECUTE RESULT:", JSON.stringify(p, null, 2));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
