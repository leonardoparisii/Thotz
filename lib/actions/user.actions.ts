"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Post from "../models/post.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  path: string;
  bio: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    //Find all posts authored by the user eith the given userId
    const posts = await User.findOne({ id: userId }).populate({
      path: "posts",
      model: Post,
      populate: {
        path: "children",
        model: Post,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return posts;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    //calculate the number of posts to skip (pagination)
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageNumber);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getNotifications(userId: string) {
  try {
    connectToDB();

    // Find all posts created by the user
    const userPosts = await Post.find({ author: userId });

    // Collect all the child posts ids (replies) from the 'children' field of each user thread
    const childThreadIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    }, []);

    // Find and return the child posts (replies) excluding the ones created by the same user
    const replies = await Post.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude posts authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}
