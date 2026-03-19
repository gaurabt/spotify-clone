'use client';

import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const { user } = useUser();

  return ( 
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex flex-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button 
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
            <RxCaretLeft className="text-white" size={35}/>
          </button>
          <button 
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
            <RxCaretRight className="text-white" size={35}/>
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20}/>
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20}/>
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <button
              onClick={() => router.push('/account')}
              className="w-9 h-9 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition"
              aria-label="Account"
            >
              <FaUserAlt size={16} className="text-white" />
            </button>
          ) : (
            <>
              <Button
                onClick={authModal.onOpen}
                className="bg-transparent text-neutral-300 font-medium">
                Sign up
              </Button>
              <Button
                onClick={authModal.onOpen}
                className="bg-white px-6 py-2">
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
   );
}
 
export default Header;