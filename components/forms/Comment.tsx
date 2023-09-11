"use client"
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/post';
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import { addCommentToPost } from '@/lib/actions/post.actions';
// import { createPost } from '@/lib/actions/post.actions';

interface CommentProps {
    postId: string;
    userImg: string;
    userId: string;
}


const Comment = ({ postId, userImg, userId }: CommentProps) => {

    const path = usePathname();
    const router = useRouter();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            post: '',
        }
    });

    //values are automatically provided by useForm
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToPost(postId, values.post, JSON.parse(userId), path);

        form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                    <FormItem className='flex gap-3 items-center w-full'>
                        <FormLabel>
                            <Image src={userImg} alt='Profile image' width={48} height={48} className='rounded-full object-cover'/>
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input
                                type='text'
                                placeholder='Comment...'
                                className='no-focus text-light-1 outline-none'
                                {...field}
                            />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment;