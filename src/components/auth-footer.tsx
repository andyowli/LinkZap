import Link from "next/link";

export function AuthFooter() {
    return (
        <div className="max-w-sm mx-auto text-sm text-gray-500 flex justify-between items-center">
            <p className="mr-4">© {new Date().getFullYear()} LinkZap</p>
            <ul className="flex gap-4 list-none">
                <li>
                    <Link 
                        href="/company/Privacy" 
                        className="hover:text-gray-700 transition-colors"
                    >
                        Privacy
                    </Link>
                </li>
                <li>
                    <Link 
                        href="/company/Terms" 
                        className="hover:text-gray-700 transition-colors"
                    >
                        Terms
                    </Link>
                </li>
            </ul>
        </div>
    );
}