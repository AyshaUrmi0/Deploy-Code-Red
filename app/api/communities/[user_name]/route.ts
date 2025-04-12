import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

// @ts-ignore
export async function GET(request) {
  try {
    const pathParts = request.url.split('/');
    const user_name = pathParts[pathParts.length - 1];

    const communityCollection = await dbConnect(collectionNameObj.communityCollection);
    const result = await communityCollection.aggregate([
      { $match: { user_name } },
      {
        $lookup: {
          from: "groupMember",
          localField: "user_name",
          foreignField: "user_name",
          as: "members"
        }
      },
      { $unwind: "$members" },
      {
        $lookup: {
          from: "user",
          localField: "members.member",
          foreignField: "name",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          memberData: {
            accessibility: "$members.accessibility",
            name: "$userDetails.name",
            group_user_name: "$members.user_name",
            user_name: "$userDetails.user_name",
            email: "$userDetails.email",
            user_photo: "$userDetails.user_photo"
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          group_name: { $first: "$group_name" },
          group_picture: { $first: "$group_picture" },
          audience: { $first: "$audience" },
          description: { $first: "$description" },
          email: { $first: "$email" },
          user_name: { $first: "$user_name" },
          Owner: {
            $push: {
              $cond: [
                { $eq: ["$members.accessibility", "Owner"] },
                "$memberData",
                "$$REMOVE"
              ]
            }
          },
          Admin: {
            $push: {
              $cond: [
                { $eq: ["$members.accessibility", "Admin"] },
                "$memberData",
                "$$REMOVE"
              ]
            }
          },
          invited: {
            $push: {
              $cond: [
                { $eq: ["$members.accessibility", "Invited"] },
                "$memberData",
                "$$REMOVE"
              ]
            }
          },
          all_Member: {
            $push: {
              $cond: [
                { $eq: ["$members.accessibility", "Member"] },
                "$memberData",
                "$$REMOVE"
              ]
            }
          },
          request: {
            $push: {
              $cond: [
                { $eq: ["$members.accessibility", "Request"] },
                "$memberData",
                "$$REMOVE"
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          group_name: 1,
          group_picture: 1,
          audience: 1,
          description: 1,
          email: 1,
          user_name: 1,
          Owner: 1,
          All_Admin: "$Admin",
          Invited_members: "$invited",
          All_Member: "$all_Member",
          Request_members: "$request"
        }
      }
    ]).toArray();

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
export async function PATCH(request) {
  try {
    const pathParts = request.url.split('/');
    const user_name = pathParts[pathParts.length - 1];
    const { member } = await request.json();

    const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection);
    const result = await groupMemberCollection.updateOne(
      { member, user_name },
      { $set: { accessibility: "Member" } }
    );

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
export async function DELETE(request) {
  try {
    const pathParts = request.url.split('/');
    const user_name = pathParts[pathParts.length - 1];
    const url = new URL(request.url);
    const member = request.headers.get("member") || url.searchParams.get("member");

    const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection);
    const result = await groupMemberCollection.deleteOne({ user_name, member });

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
