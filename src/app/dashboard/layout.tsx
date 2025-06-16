"use client";

import Sidebar from "@/app/layouts/Sidebar";
import { ReactNode } from "react";
import {
  Calendar,
  CircleFadingPlus,
  CircleUserRound,
  DoorClosedLocked,
  DoorOpen,
  House,
  LucideIcon,
  PencilLine,
  ScanLine,
  School,
  University,
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
      title: "Departemen",
      icon: University,
      link: `/dashboard/department`,
    },
    {
      title: "Ruangan",
      icon: DoorOpen,
      link: `/dashboard/room`,
    },
    {
      title: "Organisasi",
      icon: School,
      link: `/dashboard/organization`,
    },
    {
      title: "Event",
      icon: PencilLine,
      link: "/dashboard/event",
    },
    {
      title: "Ajuan Ruangan",
      icon: DoorClosedLocked,
      link: "/dashboard/room-request",
    },
    {
      title: "Undangan",
      icon: Calendar,
      link: "/dashboard/invitation",
    },
    {
      title: "Undangan Saya",
      icon: Calendar,
      link: "/dashboard/my-invitation",
    },
    {
      title: "Permintaan Booking",
      icon: CircleFadingPlus,
      link: "/dashboard/booking-request",
    },
    {
      title: "Presensi Event",
      icon: ScanLine,
      link: "/dashboard/presensi",
    },
  ];

  const filterNavbarLinks = (role: string) => {
    switch (role) {
      case "admin":
        return AllNavbarLinks;
      case "user":
        return AllNavbarLinks.filter(
          (link) =>
            link.link === "/dashboard" ||
            link.link === "/dashboard/profile" ||
            link.link === "/dashboard/my-invitation",
        );
      case "ormawa":
        return AllNavbarLinks.filter(
          (link) =>
            link.link === "/dashboard" ||
            link.link === "/dashboard/profile" ||
            link.link === `/dashboard/event` ||
            link.link === `/dashboard/invitation` ||
            link.link === `/dashboard/booking-request` ||
            link.link === `/dashboard/presensi`,
        );
      case "departemen":
        return AllNavbarLinks.filter(
          (link) =>
            link.link === "/dashboard" ||
            link.link === "/dashboard/profile" ||
            link.link === `/dashboard/room` ||
            link.link === `/dashboard/room-request`,
        );
      default:
        return [];
    }
  };

  const NavbarLinks = filterNavbarLinks(user?.role || "");

  return (
    <>
      <main>
        <Sidebar topNav={NavbarLinks} />
        <section className="pt-[75px] md:pt-[80px] md:pl-64">
          <div className="px-8 py-4 max-lg:p-4">{children}</div>
        </section>
      </main>
    </>
  );
};

export default ChildrenLayout;
