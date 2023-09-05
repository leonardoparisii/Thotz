"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Post from "../models/post.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createPost({ text, author, communityId, path }: Params) {
    
    try{
        connectToDB();

        const createdPost = await Post.create({ text, author, community: null});

        //update user model

        await User.findByIdAndUpdate(author, {
            $push: { posts: createdPost._id}
        });


        revalidatePath(path)
    } catch(error: any){
        throw new Error(`Error creating the post: ${error.message}`)
    }
}