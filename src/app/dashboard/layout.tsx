"use client";

import Sidebar from "@/app/layouts/Sidebar";
import { ReactNode } from "react";
import {
  CircleUserRound,
  House,
  LucideIcon,
  PencilLine,
  Users,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

type ChildrenLayoutProps = {
  children: ReactNode;
};

type NavbarLink = {
  title: string;
  icon: LucideIcon;
  link: string;
};

const ChildrenLayout = ({ children }: ChildrenLayoutProps) => {
  const { user } = useAuthStore();

  const AllNavbarLinks: NavbarLink[] = [
    {
      title: "Beranda",
      icon: House,
      link: "/dashboard",
    },
    {
      title: "Profil",
      icon: CircleUserRound,
      link: `/dashboard/profile`,
    },
    {
      title: "Event",
      icon: PencilLine,
      link: "/dashboard/event",
    },
    {
      title: "Ruangan",
      icon: Users,
      link: "/dashboard/rooms",
    },
  ];

  const filterNavbarLinks = (role: string) => {
    switch (role) {
      case "user":
        return AllNavbarLinks;
      case "writer":
        return AllNavbarLinks.filter(
          (link) =>
            link.link === "/dashboard" ||
            link.link === "/dashboard/write" ||
            link.link === `/dashboard/user/profile`,
        );
      default:
        return [];
    }
  };

  const NavbarLinks = filterNavbarLinks(user?.role || "");

  return (
    <>
      <div>
        <Sidebar topNav={NavbarLinks} />
        <div className="pt-[75px] md:pt-[80px] md:pl-64">{children}</div>
      </div>
    </>
  );
};

export default ChildrenLayout;
