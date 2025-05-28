import Link from "next/link";
import Image from "next/image";
import CustomButton from "./custom-button";
import { navItems } from "@/utils";
import { appName } from "@/constants";

const Navbar = () => {
  return (
    <header className="relative z-10 border-b border-gray-100 px-4">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/transparentlogo.png"
            alt="Car Hub Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>
        <div className="hidden md:flex gap-4">
          {navItems.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              className=" max-w-[500px] text-primary-blue hover:bg-primary-blue hover:text-white py-4 px-2 rounded-full hover:border-2 border-white font-semibold"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Link href="/signin">
          <CustomButton
            title="Sign In"
            btnType="button"
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px] border-2 border-primary-blue hover:bg-primary-blue hover:text-white"
          />
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
