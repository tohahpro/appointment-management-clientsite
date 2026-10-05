import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/navitems.config";
import { UserInfo } from "../../../../types/user.interface";
import { NavSection } from "../../../../types/dashboard.interface";
import DashboardSidebarContent from "./DashboardSidebarContent";


const DashboardSidebar = async () => {

    const userInfo = (await getUserInfo()) as UserInfo;

    const navItems: NavSection[] = await getNavItemsByRole(userInfo.role)
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);


    return <DashboardSidebarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
    />
};

export default DashboardSidebar;