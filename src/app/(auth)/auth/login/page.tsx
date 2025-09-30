import Image from "next/image";
import qr from "@/assets/images/auth/authqrcode.png";
import { LoginForm } from "@/components/pages/auth/LoginForm";
const LoginPage = () => {
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
        <LoginForm />
      </div>
      <div className="w-1/2 loginimg h-full"></div>
    </div>
  );
};

export default LoginPage;
