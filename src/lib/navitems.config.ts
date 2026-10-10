
import { NavSection } from "../../types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";


export const getCommonNavItems = (role: UserRole): NavSection[] => {

    const defaultDashboard = getDefaultDashboardRoute(role)

    return [
        {
            items: [
                {
                    title: "Home",
                    href: '/',
                    icon: "Home",
                    roles: ['ADMIN', 'SUPER_ADMIN', 'PATIENT', 'DOCTOR']
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ['ADMIN', 'SUPER_ADMIN', 'PATIENT', 'DOCTOR']
                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                    roles: ['ADMIN', 'SUPER_ADMIN', 'PATIENT', 'DOCTOR']
                },
                {
                    title: 'Change Password',
                    href: '/change-password',
                    icon: 'Settings',
                    roles: ['ADMIN', 'PATIENT', 'DOCTOR']
                }
            ]
        },
    ]
}

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Doctors",
                href: "/admin/dashboard/doctors-management",
                icon: "Stethoscope",
                roles: ['ADMIN'],
            },
            {
                title: "Patients",
                href: "/admin/dashboard/patients-management",
                icon: "Users",
                roles: ['ADMIN'],
            },
        ],
    },
    {
        title: "HealthCare Management",
        items: [
            {
                title: "Appointments",
                href: "/admin/dashboard/appointments-management",
                icon: "Calendar",
                roles: ['ADMIN'],
            },
            {
                title: "Specialities",
                href: "/admin/dashboard/spcecialities-management",
                icon: "Hospital",
                roles: ['ADMIN'],
            },
        ],
    }
]

export const doctorNavItems: NavSection[] = [
    {
        title: "Patient Management",
        items: [
            {
                title: "Appointments",
                href: "/doctor/dashboard/appointments",
                icon: "Calendar",
                badge: "3",
                roles: ['DOCTOR'],
            },
            {
                title: "My Schedules",
                href: "/doctor/dashboard/my-schedules",
                icon: "Clock",
                roles: ['DOCTOR'],
            },
            {
                title: "Prescriptions",
                href: "/doctor/dashboard/prescriptions",
                icon: "FileText",
                roles: ['DOCTOR'],
            },
        ],
    }
]

export const patientNavItems: NavSection[] = [
    {
        title: 'Appointments',
        items: [
            {
                title: 'My Appointments',
                href: '/dashboard/my-appointments',
                icon: 'Calender',
                roles: ['PATIENT']
            },
            {
                title: 'Book Appointment',
                href: '/consultation',
                icon: 'ClipboardList',
                roles: ['PATIENT']
            },
        ]
    },
    {
        title: 'Medical Records',
        items: [
            {
                title: 'My Prescriptions',
                href: '/dashboard/my-prescriptions',
                icon: 'FileText',
                roles: ['PATIENT']
            },
            // {
            //     title: 'Health Records',
            //     href: '/dashboard/health-records',
            //     icon: 'Activity',
            //     roles: ['PATIENT']
            // },
        ]
    }
]


// export const getNavItemsByRole = (role: UserRole): NavSection[] =>{
export const getNavItemsByRole = async (role: UserRole): Promise<NavSection[]> => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "DOCTOR":
            return [...commonNavItems, ...doctorNavItems];
        case "PATIENT":
            return [...commonNavItems, ...patientNavItems];
        case "SUPER_ADMIN":
            return [...commonNavItems, ...adminNavItems];

        default:
            return [];
    }
}

