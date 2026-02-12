import { EmptyData } from "../../components/empty-data";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar-wrapper";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

const Blog = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-40">
                <EmptyData />
            </main>

            <Footer />
        </div>
    )
}

export default Blog;