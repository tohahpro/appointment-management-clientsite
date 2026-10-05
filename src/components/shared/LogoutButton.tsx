"use client"

import { logoutUser } from "@/services/auth/logout";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {

    const handleLogout = async () => {
        await logoutUser();
    }

    return (
        <div>
            <Button className="cursor-pointer w-full" variant={"outline"} onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
            </Button>
        </div>
    );
};

export default LogoutButton;