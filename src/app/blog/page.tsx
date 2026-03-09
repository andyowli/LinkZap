import Banner from "../../components/banner";
import { EmptyData } from "../../components/empty-data";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar-wrapper";

const Blog = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Banner />

            <Navbar topClass="top-10" />

            <div className="flex-1 flex items-center justify-center">
                <EmptyData />
            </div>

            <Footer />
        </div>
    )
}

export default Blog;