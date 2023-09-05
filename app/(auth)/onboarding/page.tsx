import AccountProfile from "@/components/forms/AccountProfile";
import  { currentUser } from '@clerk/nextjs'
async function Page() {
    //I'm gonna combine the data between the db's data and the data that clerk is able to provide me
    //the user data come directly from clerk auth
    const user = await currentUser();

    //the userInfo data come from the database
    const userInfo = {};

    //as you can see, the userData will be the final user data object with the db and clerk data combined
    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    }
    return(
        <main className="flex max-w-3xl flex-col mx-auto p-10">
            <h1 className="head-text">
                Onboarding
            </h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile and start sharing your Thotz now!
            </p>
            <section className="mt-9 p-10">
                <AccountProfile user={userData} btnTitle='Continue'/>
            </section>
        </main>
    )
}

export default Page;