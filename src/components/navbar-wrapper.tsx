import { getNavbarSession } from "./navbar";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
    const session = await getNavbarSession();
    const isLoggedIn = !!session;
    const user = session?.user || null;
    console.log('isLoggedIn',isLoggedIn);
    return <NavbarClient isLoggedIn={isLoggedIn} user={user} />;
}

