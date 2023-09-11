import { OrganizationSwitcher, RedirectToSignIn, SignOutButton, SignedIn, SignedOut, UserButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from '@clerk/themes'
import { redirect, useRouter } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

async function Topbar() {
    const user = await currentUser();
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded === false) redirect("/onboarding");
    return (
        <nav className="topbar">
            <Link href='/' className="flex items-center gap-4">
                <Image  src='/logo.svg' alt="logo" width={28} height={28}/>
                <p className="text-[22px] font-light text-white max-xs:hidden">
                    THOTZ
                </p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image
                                    src='/assets/logout.svg'
                                    alt="logout"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                    <SignedOut>
                        <RedirectToSignIn />
                    </SignedOut>
                </div>

                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: "py-2 px-4"
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Topbar;