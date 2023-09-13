"use client"
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '../ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { PostValidation } from '@/lib/validations/post';
import { createPost } from '@/lib/actions/post.actions';
import { useOrganization } from '@clerk/nextjs';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string
}

function Post({ userId }: { userId: string}){

    const path = usePathname();
    const router = useRouter();
    const { organization } = useOrganization();
    
    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: '',
            accountId: userId
        }
    });

    //values are automatically provided by useForm
    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        await createPost({
            text: values.post,
            author: userId,
            communityId: organization ? organization.id : null,
            path: path
        });

        router.push("/")
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10 mt-10"
            >
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Content
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-3 bg-dark-3 text-light-1'>
                            <Textarea
                                rows={15}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type='submit' className='bg-[#165ddb]'>
                    Post it!
                </Button>
            </form>
        </Form>
    )
}

export default Post;