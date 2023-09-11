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

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDB();


    //calculate the number of posts to skip (pagination)
    const skipAmount = (pageNumber - 1) * pageSize

    //Fetch the posts with no parents (top level posts)
    const postsQuery = Post.find({
        parentId: { $in: [null, undefined]}})
            .sort({createdAt: 'desc'}) //descending (cronologic order)
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User})
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            });

    const totalPostsCount = await Post.countDocuments({parentId: { $in: [null, undefined]} })

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function fetchPostById(id: string) {
    connectToDB();

    try {
        const post = await Post.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    //getting data of the comments of the comments
                    {
                        path: 'children',
                        model: Post,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

            return post;
    } catch (error: any) {
        throw new Error(`Error getting post's data: ${error.message}`)
    }
}

export async function addCommentToPost(
    postId: string,
    text: string,
    userId: string,
    path: string
)   {
    connectToDB();

    try {
        // Find the original post by its id
        const originalPost = await Post.findById(postId);

        if (!originalPost){
            throw new Error("Post not found!")
        }

        //create the comment

        const comment = new Post({
            text: text,
            author: userId,
            parentId: postId,
        });

        //save the new post
        const saveComment = await comment.save();

        //update the original post to include the comment
        originalPost.children.push(saveComment._id)

        //save the original post
        await originalPost.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Errora adding comment ${error.message}`)
    }
}