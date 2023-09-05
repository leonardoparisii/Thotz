'use client'
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'

function LeftSidebar() {
    const path = usePathname();
    const router = useRouter();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-4 px-6">
                {sidebarLinks.map((item) => {
                    const isActive = (path.includes(item.route) && item.route.length > 1) || path === item.route
                    return (
                        <Link href={item.route} key={item.label} className={`leftsidebar_link ${isActive && 'bg-[#165DDB]'}`}>
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                            />
                            <p className="text-light-1 max-lg:hidden">{item.label}</p>
                        </Link>
                )})}
            </div>

            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image
                                src='/assets/logout.svg'
                                alt="logout"
                                width={20}
                                height={20}
                            />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar;