'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();

  const onClick = () => {
    //Add authentication later
    router.push(href);
  }

  return ( 
    <button
      onClick={onClick}
      className="
        relative
        group
        flex
        items-center
        gap-x-4
        rounded-md
        overflow-hidden
        bg-neutral-100/10
        hover:bg-neutral-100/20
        transition
        pr-4
        cursor-pointer"
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image 
          className="object-cover"
          src={image} 
          alt="List Item" 
          fill
        />
      </div>
      <p className="font-medium truncate py-5">
        {name}
      </p>
      <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 right-5 drop-shadow-md group-hover:opacity-100 hover:scale-110">
        <FaPlay className="text-black"/>
      </div>
    </button>
   );
}
 
export default ListItem;