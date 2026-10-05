
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { UserInfo } from "../../../../types/user.interface";
import { getNavItemsByRole } from "@/lib/navitems.config";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {

    const userInfo = (await getUserInfo()) as UserInfo;

    const navItems = await getNavItemsByRole(userInfo.role)
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);

    return <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
};

export default DashboardNavbar;