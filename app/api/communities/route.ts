import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

// @ts-ignore
export async function GET(request) {
  try {
    const communityCollection = await dbConnect(collectionNameObj.communityCollection);
    const result = await communityCollection.find().toArray();
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

// @ts-ignore
export async function POST(request) {
  try {
    const data = await request.json();
    const communityCollection = await dbConnect(collectionNameObj.communityCollection);
    const result = await communityCollection.insertOne(data);
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
