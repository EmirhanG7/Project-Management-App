import {Outlet} from 'react-router-dom';
import Header from "@/components/Header.jsx";

export default function Layout() {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-6 md:px-12 text-foreground">
        <Outlet />
      </main>
    </div>
  );
}
