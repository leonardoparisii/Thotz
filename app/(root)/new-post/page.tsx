import Post from "@/components/forms/Post";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page () {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarder) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">Post a new Post</h1>

            <Post userId={userInfo._id} />
        </>
    )
}

export default Page;