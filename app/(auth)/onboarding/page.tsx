import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex min-w-[75%] flex-col justify-start px-8 py-18">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile!
      </p>

      <section className="mt-9 bg-dark-2 p-8 md:p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
