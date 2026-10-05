import DashboardNavbar from "@/components/moduels/Dahsboard/DashboardNavbar";
import DashboardSidebar from "@/components/moduels/Dahsboard/DashboardSidebar";

export const dynamic = "force-dynamic";
const CommonDashboardLayout = async ({ children, }: { children: React.ReactNode; }) => {

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <DashboardSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <DashboardNavbar />
                    <main className="flex-1 overflow-y-auto bg-muted/10">
                        <div className="">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default CommonDashboardLayout;