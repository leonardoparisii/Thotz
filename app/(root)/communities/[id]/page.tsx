import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import PostsTab from "@/components/shared/PostsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

const Page = async ({ params }: { params: { id: string }}) => {

    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id)

    console.log(communityDetails)
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                bio={communityDetails.bio}
                imgUrl={communityDetails.image}
                type='Community'
            />

            <div className="mt-9">
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>

                                {tab.label === 'Posts' && (
                                    <p className="m-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {communityDetails?.posts?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                        <TabsContent className="w-full text-light-1" value='posts'>
                            <PostsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>
                        <TabsContent className="w-full text-light-1" value='members'>
                            <section className="mt-9 flex flex-col gap-10">
                                 {communityDetails?.members.map((member: any) => (
                                    <UserCard
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username}
                                        imgUrl={member.image}
                                        personType="User"
                                    />
                                 ))}
                            </section>
                        </TabsContent>
                        <TabsContent className="w-full text-light-1" value='requests'>
                            <PostsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>
                </Tabs>
            </div>
        </section>
    )   
}

export default Page;