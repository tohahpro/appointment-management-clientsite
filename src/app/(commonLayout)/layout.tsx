import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"

const CommonLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {

    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default CommonLayout