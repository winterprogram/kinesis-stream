import { Db } from "mongodb";
import { Context, KinesisStreamEvent } from "aws-lambda";
import { requestHandler } from "./handler/root_handler";
import { connect } from "mongodb";

let cachedDb: Db;

export async function connectToDatabase(uri: string) {
  console.log("=> connect to database");

  if (cachedDb) {
    console.log("=> using cached database instance");
    return await Promise.resolve(cachedDb);
  }

  const db = await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = db.db();
  return cachedDb;
}

const handler = async (event: KinesisStreamEvent, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log(JSON.stringify(event));
    const payload = event.Records.map((item) =>
      Buffer.from(item.kinesis.data, "base64").toString()
    );
    await requestHandler(payload);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export { handler };

// handler(
//   {
//     Records: [
//       {
//         kinesis: {
//           kinesisSchemaVersion: '1.0',
//           partitionKey: 'user',
//           sequenceNumber:
//             '49610675455564907913847426673246955138326106933183905794',
//           data:
//             'eyJldmVudCI6InJhem9ycGF5IiwiZGF0YSI6eyJlbnRpdHkiOiJldmVudCIsImFjY291bnRfaWQiOiJhY2NfRVE5MFFrc0JnVjRHY1QiLCJldmVudCI6ImZ1bmRfYWNjb3VudC52YWxpZGF0aW9uLmNvbXBsZXRlZCIsImNvbnRhaW5zIjpbImZ1bmRfYWNjb3VudC52YWxpZGF0aW9uIl0sInBheWxvYWQiOnsiZnVuZF9hY2NvdW50LnZhbGlkYXRpb24iOnsiZW50aXR5Ijp7ImlkIjoiZmF2X0dNUW9STFpzVEFnSDZiIiwiZW50aXR5IjoiZnVuZF9hY2NvdW50LnZhbGlkYXRpb24iLCJmdW5kX2FjY291bnQiOnsiaWQiOiJmYV9HTVFvUWpDUUlXVzVzWSIsImVudGl0eSI6ImZ1bmRfYWNjb3VudCIsImNvbnRhY3RfaWQiOiJjb250X0ZRdDZheEcyNFRlbkowIiwiYWNjb3VudF90eXBlIjoiYmFua19hY2NvdW50IiwiYmFua19hY2NvdW50Ijp7Imlmc2MiOiJQWVRNMDEyMzQ1NiIsImJhbmtfbmFtZSI6IlBheXRtIFBheW1lbnRzIEJhbmsiLCJuYW1lIjoiUHJhdmVlYiBUYWxyZWphIiwibm90ZXMiOltdLCJhY2NvdW50X251bWJlciI6IjkxNzAyMTM2MTQwNyJ9LCJiYXRjaF9pZCI6bnVsbCwiYWN0aXZlIjp0cnVlLCJjcmVhdGVkX2F0IjoxNjEwMDI1NjkzLCJkZXRhaWxzIjp7Imlmc2MiOiJQWVRNMDEyMzQ1NiIsImJhbmtfbmFtZSI6IlBheXRtIFBheW1lbnRzIEJhbmsiLCJuYW1lIjoiUHJhdmVlYiBUYWxyZWphIiwibm90ZXMiOltdLCJhY2NvdW50X251bWJlciI6IjkxNzAyMTM2MTQwNyJ9fSwic3RhdHVzIjoiY29tcGxldGVkIiwiYW1vdW50IjoxMDAsImN1cnJlbmN5IjoiSU5SIiwibm90ZXMiOnsidXNlcl9pZCI6IlM2dURydlBsdUlSbVNUWnVrS1lLR1A0MVlBbzEiLCJwcm9qZWN0IjoiYmhhcmF0a2hhdGEiLCJlbnZpcm9ubWVudCI6Im5wIiwidW5pcV9pZCI6Ijg4Zjg4MDU5YThkNTRjZGZiMzUwYWVkZDQzNGQ1YzlmIn0sInJlc3VsdHMiOnsiYWNjb3VudF9zdGF0dXMiOiJhY3RpdmUiLCJyZWdpc3RlcmVkX25hbWUiOiJQUkFWRUVOIEJIQUdDSEFORCBUQSJ9LCJjcmVhdGVkX2F0IjoxNjEwMDI1Njk0LCJ1dHIiOm51bGx9fX0sImNyZWF0ZWRfYXQiOjE2MTAwMjU2OTR9fQ==',
//           approximateArrivalTimestamp: 1600069256.971,
//         },
//         eventSource: 'aws:kinesis',
//         eventVersion: '1.0',
//         eventID:
//           'shardId-000000000000:49610675455564907913847426673246955138326106933183905794',
//         eventName: 'aws:kinesis:record',
//         invokeIdentityArn:
//           'arn:aws:iam::949850319980:role/bk-np-lambda-role-analytics-stream',
//         awsRegion: 'ap-south-1',
//         eventSourceARN:
//           'arn:aws:kinesis:ap-south-1:949850319980:stream/bk-np-datastream-analytics',
//       },
//     ],
//   },
//   { callbackWaitsForEmptyEventLoop: false } as any
// );
