import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.js";
import { UserCog, Settings, LogOut } from 'lucide-react';

export default function Header({user, onLogout}) {


  return (
    <header className="flex items-center justify-center px-6 md:px-12 py-4 bg-white shadow">
      <div className='flex justify-between w-full'>
        <Link to="/" className="text-xl font-bold">
          Project Management App
        </Link>
        {user &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <span className='hidden sm:block'>{user?.name}</span>
                <UserCog />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
              <DropdownMenuLabel className='flex flex-col gap-1'>
                <span className='font-bold text-[16px] text-black'>
                  {user?.name}
                </span>
                <span className='text-black/70'>
                  {user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings />
                  <Link to="#">Hesap ayarları</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} >
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </header>
  )
}