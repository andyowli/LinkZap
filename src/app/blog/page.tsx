import { EmptyData } from "../../components/empty-data";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

const Blog = () => {
    return (
        <div>
            <Navbar />
            <EmptyData />

            <Footer />
        </div>
    )
}

export default Blog;