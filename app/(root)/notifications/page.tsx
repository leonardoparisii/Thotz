import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getNotifications } from "@/lib/actions/user.actions";

const Notifications = async () => {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    //getNotifications
    const activity = await getNotifications(userInfo._id);

    return(
        <section>
            <h1 className="head-text mb-10">Notifications</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((notification) => (
                            <Link key={notification._id} href={`/post/${notification.parentId}`}>
                                <article className="notification-card">
                                   <Image
                                        src={notification.author.image}
                                        alt='Profile picture'
                                        width={22}
                                        height={22}
                                        className="rounded-full object-cover"
                                   />
                                   <p  className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {notification.author.name}{" "}
                                        </span>
                                        replied to your post!
                                   </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="no-result">No activity yet</p>
                )}
            </section>
        </section>
    )
}

export default Notifications;