'use client';

import { useRouter } from "next/navigation";

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
    <div>
      list item
    </div>
   );
}
 
export default ListItem;