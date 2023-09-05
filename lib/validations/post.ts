import * as z from 'zod';
//chadcn & react-hook-form schema
export const PostValidation = z.object({
   post: z.string().nonempty().min(3, {message: 'minimum 3 cahracters'}).max(1000, {message: 'maximum 1000 characters'}),
   accountId: z.string(),
})

export const CommentValidation = z.object({
   post: z.string().nonempty().min(3, {message: 'minimum 3 cahracters'}).max(1000, {message: 'maximum 1000 characters'}),
})