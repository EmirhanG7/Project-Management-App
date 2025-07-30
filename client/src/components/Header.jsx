import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.js";
import { UserCog, Settings, LogOut, Sun, Moon } from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "@/api.js";
import {clearUser} from "@/store/authSlice.js";
import { Switch } from "@/components/ui/switch"
import {useEffect, useState} from "react";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDark(htmlElement.classList.contains('dark'));
  }, []);

  const toggleTheme = (checked) => {
    const htmlElement = document.documentElement;

    if (checked) {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;

    if (savedTheme) {
      htmlElement.classList.remove('light', 'dark');
      htmlElement.classList.add(savedTheme);
      setIsDark(savedTheme === 'dark');
    } else {
      htmlElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  }, []);




  const handleLogout = async () => {
    await logout()
    dispatch(clearUser())
    navigate('/login');
  };
  const user = useSelector(state => state.auth.user)




  return (
    <header className="px-6 md:px-12 py-4 bg-card border-b border-border shadow">
      <div className={`flex w-full ${user ? 'justify-between' : 'justify-center'} `}>
        <Link to="/" className="text-xl font-bold text-center text-card-foreground hover:text-primary">
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
            <DropdownMenuContent className="min-w-56 bg-popover border-border">
              <DropdownMenuLabel className='flex flex-col gap-1'>
                <span className='font-bold text-[16px] text-popover-foreground '>
                  {user?.name}
                </span>
                <span className='text-muted-foreground'>
                  {user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-popover-foreground hover:bg-accent-foreground">
                  <Settings />
                  <Link className='w-full' to="/settings">
                    Hesap ayarları
                  </Link>

                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive" >
                  <LogOut />
                  <span className='w-full'>
                    Log out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </header>
  )
}