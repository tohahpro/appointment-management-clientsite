"use client"

import Image from "next/image";
import logoImage from "../../assets/logo/Tarevia-logo.png";


const BrandLogo = () => {

    return (
        <>
            <div className="flex items-center">
                <div
                    className="relative block aspect-video w-36.25 shrink-0 md:w-60"
                >
                    <Image
                        src={logoImage}
                        alt="Nessa Foundation"
                        fill
                        priority
                        sizes="(max-width: 640px) 145px, (max-width: 1024px) 165px, 178px"
                        className="object-contain"
                    />
                </div>
            </div>
        </>
    );
};

export default BrandLogo;