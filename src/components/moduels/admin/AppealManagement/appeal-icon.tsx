import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Building2,
    CalendarDays,
    Clock3,
    Construction,
    Droplets,
    Factory,
    FileText,
    Gift,
    HandCoins,
    HandHeart,
    Heart,
    HeartHandshake,
    HeartPulse,
    Home,
    Landmark,
    LockKeyhole,
    LucideIcon,
    MapPin,
    PackageCheck,
    Quote,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    // General
    heart: Heart,
    gift: Gift,
    users: Users,
    user: Users,
    home: Home,
    building: Building2,
    factory: Factory,
    construction: Construction,
    location: MapPin,
    "map-pin": MapPin,

    // Islamic
    mosque: Landmark,
    landmark: Landmark,
    book: BookOpen,
    "book-open": BookOpen,
    calendar: CalendarDays,
    "calendar-days": CalendarDays,

    // Giving
    hand: HandHeart,
    "hand-heart": HandHeart,
    "hand-coins": HandCoins,
    coins: HandCoins,
    "heart-handshake": HeartHandshake,
    handshake: HeartHandshake,

    // Medical
    stethoscope: Stethoscope,
    medical: Stethoscope,
    "heart-pulse": HeartPulse,
    pulse: HeartPulse,

    // Water
    droplets: Droplets,
    water: Droplets,

    // Security
    shield: ShieldCheck,
    "shield-check": ShieldCheck,
    badge: BadgeCheck,
    "badge-check": BadgeCheck,
    lock: LockKeyhole,
    "lock-keyhole": LockKeyhole,

    // Reporting and delivery
    file: FileText,
    report: FileText,
    "file-text": FileText,
    package: PackageCheck,
    "package-check": PackageCheck,

    // Other
    quote: Quote,
    clock: Clock3,
    "clock-3": Clock3,
    arrow: ArrowRight,
    "arrow-right": ArrowRight,
};

interface AppealIconProps {
    name?: string | null;
    className?: string;
}

export function AppealIcon({
    name,
    className = "h-5 w-5",
}: AppealIconProps) {
    const normalizedName = name
        ?.trim()
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-");

    const Icon =
        iconMap[normalizedName ?? ""] ?? Heart;

    return <Icon className={className} />;
}