'use client'
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Bottombar() {
    const path = usePathname();
    const router = useRouter();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((item) => {
                    const isActive = (path.includes(item.route) && item.route.length > 1) || path === item.route
                    return (
                        <Link href={item.route} key={item.label} className={`bottombar_link ${isActive && 'bg-[#165DDB]'}`}>
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                            />
                            <p className="text-subtle-medium text-light-1 max-sm:hidden">{item.label}</p>
                        </Link>
                )})}
            </div>
        </section>
    )
}

export default Bottombar;