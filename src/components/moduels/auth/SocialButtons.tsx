import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function SocialButtons() {

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  return (
    <div className="flex flex-wrap">
      <Button
        variant="outline"
        type="button"
        className="w-full flex text-white lg:text-black items-center justify-center gap-2 border-white/20 lg:border-black/10 bg-white/20
                  hover:bg-white/30 hover:shadow-2xl hover:scale-[1.02] lg:hover:scale-[1.0] transition-all duration-300 cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <FcGoogle />
        Google
      </Button>
    </div>
  )
}
