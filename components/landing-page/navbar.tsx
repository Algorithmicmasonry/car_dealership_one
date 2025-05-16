import Link from "next/link";
import Image from "next/image";
import CustomButton from "./custom-button";

const Navbar = () => {
  return (
    <header className="relative z-10 w-full border-b px-4">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 p-4">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="Car Hub Logo"
            width={118}
            height={18}
            className="object-contain"
          />
        </Link>

        <CustomButton
          title="Sign In"
          btnType="button"
          containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
        />
      </nav>
    </header>
  );
};

export default Navbar;
