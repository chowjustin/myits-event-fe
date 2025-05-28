"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { LogOut, LucideIcon, Menu, User, X } from "lucide-react";
import NextImage from "@/components/NextImage";
import useAuthStore from "@/app/stores/useAuthStore";
import { removeToken } from "@/lib/cookies";
import parseRole from "@/utils/parseRole";

type SidenavProps = {
  topNav: {
    title: string;
    icon: LucideIcon;
    link: string;
  }[];
};

export default function Sidebar({ topNav }: SidenavProps) {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const path = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".profile-menu-container")) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    removeToken();
    router.replace("/login");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between h-[60px] max-md:h-[55px] px-2 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <Link href="/" className="flex items-center">
              <NextImage
                src="/myits-event.png"
                width={2000}
                height={2000}
                alt="Logo myITS Event"
                className="max-w-[100px] max-md:max-w-[75px]"
              />
            </Link>
          </div>

          <div className="relative profile-menu-container">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 md:p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-900">
                    {parseRole(user?.role)}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside
        className={`hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white`}
      >
        <div className="flex flex-col w-full py-4">
          <nav className="flex-1 pr-6">
            <div className="space-y-1">
              {topNav.map((link) => (
                <Link
                  href={link.link}
                  key={link.title}
                  className={`flex items-center gap-3 px-[25px] py-[15px] text-black rounded-r-full text-sm font-medium transition-colors ${
                    path === link.link
                      ? "bg-[#00000010]"
                      : "hover:bg-[#00000010]"
                  }`}
                >
                  <link.icon className={`min-w-5 w-fit h-5 text-blue-600`} />
                  <span className="truncate">{link.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex profile-menu-container">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-80 max-w-[80vw] bg-white shadow-xl">
            <nav className="flex-1 pt-[72px] pr-4">
              <div className="space-y-1">
                {topNav.map((link) => (
                  <Link
                    href={link.link}
                    key={link.title}
                    className={`flex items-center gap-3 px-[25px] py-[15px] text-black rounded-r-full text-sm font-medium transition-colors ${
                      path === link.link
                        ? "bg-[#00000010]"
                        : "hover:bg-[#00000010]"
                    }`}
                  >
                    <link.icon className={`min-w-5 w-fit h-5 text-blue-600`} />
                    <span className="truncate">{link.title}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
