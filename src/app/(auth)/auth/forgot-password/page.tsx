import Image from "next/image";
import qr from "@/assets/images/auth/authqrcode.png";

import { ForgotPasswordForm } from "@/components/pages/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="flex">
      <div className="w-1/2 flex flex-col items-center justify-center ">
        <Image
          src={qr}
          alt="Login Image"
          width={138}
          height={138}
          objectFit="cover"
        />
        <ForgotPasswordForm />
      </div>
      <div className="w-1/2 forgot-password-img h-full"></div>
    </div>
  );
};

export default ForgotPasswordPage;
