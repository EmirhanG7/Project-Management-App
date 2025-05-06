import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.js";
import { UserCog, Settings, LogOut } from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "@/api.js";
import {clearUser} from "@/store/authSlice.js";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logout()
    dispatch(clearUser())
    navigate('/login');
  };
  const user = useSelector(state => state.auth.user)


  return (
    <header className="px-6 md:px-12 py-4 bg-white shadow">
      <div className={`flex w-full ${user ? 'justify-between' : 'justify-center'} `}>
        <Link to="/" className="text-xl font-bold text-center">
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
                <DropdownMenuItem onClick={handleLogout} >
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