"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>(
    user?.image ? [user.image] : []
  );

  const { startUpload } = useUploadThing("media");
  const path = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photos: [], // Use an array to store multiple images
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string[]) => void
  ) => {
    e.preventDefault();

    const uploadedImages: string[] = [...form.getValues().profile_photos]; // Copy existing image URLs
    const newFiles: File[] = [];

    // Check if files exist and there are multiple files
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = Array.from(e.target.files);

      // Log the array of files
      console.log("Selected files:", imageFiles);

      // Iterate through each file and create a new FileReader for each
      imageFiles.forEach((file) => {
        if (file.type.includes("image")) {
          const fileReader = new FileReader();

          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            uploadedImages.push(imageDataUrl);
            newFiles.push(file); // Store the new files for later use

            if (uploadedImages.length === imageFiles.length) {
              // After all images are processed, update the field value and selected images
              fieldChange(uploadedImages);
              setSelectedImages(uploadedImages);
            }
          };

          fileReader.readAsDataURL(file);
        }
      });
    }

    // Log the array of new files
    console.log("New files:", newFiles);
  };

  async function onSubmit(values: {
    profile_photos: string[];
    name: string;
    username: string;
    bio: string;
  }) {
    const hasImageChanged = values.profile_photos.length > 0;

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes.length > 0) {
        values.profile_photos = imgRes.map((img) => img.url);
      }
    }

    await updateUser({
      userId: user.id,
      image: values.profile_photos[0], // Update this line to use the first image
      name: values.name,
      bio: values.bio,
      path: path,
      username: values.username,
    });

    if (path === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        {/* image field */}
        <FormField
          control={form.control}
          name="profile_photos"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {selectedImages.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`profile photo ${index + 1}`}
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ))}
                {selectedImages.length === 0 && (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* username field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* bio field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-[#165DDB]">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
