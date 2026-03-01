import { getNavbarSession } from "./navbar";
import { NavbarClient } from "./navbar-client";

interface NavbarProps {
    isFixed?: boolean;
    topClass?: string;
}

export async function Navbar({ isFixed = true, topClass }: NavbarProps = {}) {
    const session = await getNavbarSession();
    const isLoggedIn = !!session;
    const user = session?.user || null;
    return (
        <NavbarClient
            isLoggedIn={isLoggedIn}
            user={user}
            isFixed={isFixed}
            topClass={topClass}
        />
    );
}

