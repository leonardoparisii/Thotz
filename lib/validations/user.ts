import * as z from 'zod';
//chadcn & react-hook-form schema
export const UserValidation = z.object({
   profile_photo: z.string().url().nonempty(),
   name: z.string().min(3, {message: 'minimum 3 cahracters'}).max(30),
   username: z.string().min(3, {message: 'minimum 3 cahracters'}).max(30),
   bio: z.string().min(3, {message: 'minimum 3 cahracters'}).max(1000, {message: 'maximum 1000 characters'}),
})