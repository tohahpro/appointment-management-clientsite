

export function SectionHeading({
    title,
    icon,
}: {
    title: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">
            {icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    {icon}
                </div>
            )}

            <h2 className="text-slate-950">
                {title}
            </h2>
        </div>
    );
}