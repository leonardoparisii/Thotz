"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deletePost } from "@/lib/actions/post.actions";

interface Props {
  postId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeletePost({
  postId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src='/assets/delete.svg'
      alt='delete'
      width={22}
      height={22}
      className='cursor-pointer object-contain'
      onClick={async () => {
        await deletePost(JSON.parse(postId), pathname);
      }}
    />
  );
}

export default DeletePost;