import { DatabasePayload } from "../types/payload";
import { MongoService } from "../service/mongo_service";

export async function requestHandler(payload: string[]) {
  const payloads: DatabasePayload[] = payload.map((item) => JSON.parse(item));
  const mongoService: MongoService = new MongoService();
  for (let payload of payloads) {
    console.log("EVENT: ", payload.event);
    console.log("SEARCH PAYLOAD: ", JSON.stringify(payload.search, null, 2));
    console.log("PAYLOAD: ", JSON.stringify(payload.data, null, 2));
    await mongoService.writeToMongoDb(
      payload.event,
      payload.data,
      payload.search
    );
  }
}
