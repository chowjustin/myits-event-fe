"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-hot-toast";
import { getToken, removeToken } from "@/lib/cookies";
import useAuthStore from "@/app/stores/useAuthStore";
import { User } from "@/types/user";
import Loading from "@/app/loading";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

const ROLE = ["user", "ormawa", "departemen", "admin"] as const;

type Role = (typeof ROLE)[number];

export interface WithAuthProps {
  user: User;
}

const DEPARTEMEN_ROUTE = "/dashboard/room";
const ORMAWA_ROUTE = "/dashboard/event";
const ADMIN_ROUTE = "/dashboard/department";
const USER_ROUTE = "/dashboard/my-invitation";

const LOGIN_ROUTE = "/login";

export enum RouteRole {
  public,
  user,
  ormawa,
  departemen,
  admin,
}

export const isRole = (p: Role): p is Role => ROLE.includes(p as Role);

const hasAccess = (
  userRole: Role,
  routeRole: keyof typeof RouteRole,
): boolean => {
  if (userRole === "admin") return true;

  switch (userRole) {
    case "user":
      return routeRole === "user" || routeRole === "public";
    case "ormawa":
      return (
        routeRole === "ormawa" || routeRole === "user" || routeRole === "public"
      );
    case "departemen":
      return (
        routeRole === "departemen" ||
        routeRole === "user" ||
        routeRole === "public"
      );

    default:
      return false;
  }
};

const getDefaultRoute = (role: Role): string => {
  switch (role) {
    case "departemen":
      return DEPARTEMEN_ROUTE;
    case "ormawa":
      return ORMAWA_ROUTE;
    case "user":
      return USER_ROUTE;
    case "admin":
      return ADMIN_ROUTE;
    default:
      return LOGIN_ROUTE;
  }
};

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole,
) {
  function ComponentWithAuth(props: T) {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect");
    const pathName = usePathname();

    //#region  //*=========== STORE ===========
    const isAuthenticated = useAuthStore.useIsAuthed();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();
    //#endregion  //*======== STORE ===========

    const checkAuth = React.useCallback(() => {
      const token = getToken();
      if (!token) {
        isAuthenticated && logout();
        stopLoading();
        return;
      }
      if (!user) {
        const loadUser = async () => {
          try {
            const res = await api.get<ApiResponse<User>>("/auth/me");
            if (!res.data.data) {
              toast.error("Sesi login tidak valid");
              throw new Error("Sesi login tidak valid");
            }

            login({
              ...res.data.data,
              token,
            });
          } catch (err) {
            await removeToken();
          } finally {
            stopLoading();
          }
        };

        loadUser();
      } else {
        stopLoading();
      }
    }, [isAuthenticated, login, logout, stopLoading, user]);

    React.useEffect(() => {
      if (isLoading && !user) {
        checkAuth();
      }

      window.addEventListener("focus", checkAuth);
      return () => {
        window.removeEventListener("focus", checkAuth);
      };
    }, [checkAuth]);

    React.useEffect(() => {
      const handleRedirect = () => {
        if (isAuthenticated && user) {
          // Handle login route redirect
          if (pathName === LOGIN_ROUTE) {
            router.replace(getDefaultRoute(user.role as Role));
            return;
          }

          // Handle role-based access
          if (routeRole === "public") {
            if (redirect) {
              router.replace(redirect as string);
            } else {
              router.replace(getDefaultRoute(user.role as Role));
            }
          } else if (!hasAccess(user.role as Role, routeRole)) {
            router.replace(getDefaultRoute(user.role as Role));
          }
        } else if (routeRole !== "public") {
          router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
        }
      };

      if (!isLoading) {
        handleRedirect();
      }
    }, [isAuthenticated, isLoading, pathName, redirect, router, user]);

    // Show loading state if:
    // 1. Initial loading
    // 2. Not authenticated and trying to access protected route
    // 3. Authenticated but user data not yet loaded
    // 4. Authenticated but doesn't have access to the route
    if (
      isLoading ||
      (!isAuthenticated && routeRole !== "public") ||
      (isAuthenticated && !user) ||
      (isAuthenticated &&
        user &&
        routeRole !== "public" &&
        !hasAccess(user.role as Role, routeRole))
    ) {
      return <Loading />;
    }

    // Only render the component if:
    // 1. It's a public route
    // 2. User is authenticated and has access
    if (
      routeRole === "public" ||
      (isAuthenticated && user && hasAccess(user.role as Role, routeRole))
    ) {
      return <Component {...(props as T)} user={user} />;
    }

    // Fallback loading state - this shouldn't normally be reached
    return <Loading />;
  }

  return ComponentWithAuth;
}
