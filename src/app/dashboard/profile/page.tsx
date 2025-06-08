"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Button from "@/components/buttons/Button";
import withAuth from "@/components/hoc/withAuth";
import EditModal from "./modal/EditModal";
import BreadCrumbs from "@/components/BreadCrumbs";
import useAuthStore from "@/app/stores/useAuthStore";
import ProfileSkeleton from "./components/ProfileSkeleton";
import ProfileField from "./components/ProfileFields";
import EditPasswordModal from "./modal/EditPasswordModal";
import useEditUserMutation from "@/app/hooks/user/useEditUserMutation";
import { useGetMe } from "@/app/hooks/user/useGetMe";
import parseRole from "@/utils/parseRole";

interface ModalState {
  name: boolean;
  username: boolean;
  email: boolean;
  role: boolean;
  password: boolean;
}

export default withAuth(ProfilePage, "user");

function ProfilePage() {
  const { user: storedUser } = useAuthStore();
  const { data: user, isPending: isGetMePending } = useGetMe();

  const [openModals, setOpenModals] = useState<ModalState>({
    name: false,
    username: false,
    email: false,
    role: false,
    password: false,
  });

  const { mutate: updateUserMutation, isPending: updateUserPending } =
    useEditUserMutation();

  const breadCrumbs = [
    { href: "/dashboard", Title: "Dashboard" },
    { href: `/dashboard/profile`, Title: "Profil" },
  ];

  const toggleModal = (modal: keyof ModalState, isOpen: boolean) => {
    setOpenModals((prev) => ({ ...prev, [modal]: isOpen }));
  };

  if (isGetMePending) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="">
          <BreadCrumbs breadcrumbs={breadCrumbs} />
        </div>
        <h1 className="text-2xl font-semibold">Profil</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <ProfileField
            label="Nama Lengkap"
            value={user?.name || ""}
            onEdit={() => toggleModal("name", true)}
          />

          <ProfileField
            label="Email"
            value={user?.email || ""}
            onEdit={() => toggleModal("email", true)}
          />

          <ProfileField
            label="Role"
            value={parseRole(user?.role) || ""}
            onEdit={() => toggleModal("role", true)}
            canEdit={storedUser?.role === "admin"}
          />

          <div className="mt-8">
            <Button
              onClick={() => toggleModal("password", true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Lock size={16} />
              Ubah Kata Sandi
            </Button>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={openModals.name}
        setIsOpen={(isOpen) => toggleModal("name", isOpen)}
        id="name"
        label="Edit Nama Lengkap"
        currentValue={user?.name || ""}
        fieldName="full_name"
        mutate={updateUserMutation}
        isPending={updateUserPending}
      />

      <EditModal
        isOpen={openModals.email}
        setIsOpen={(isOpen) => toggleModal("email", isOpen)}
        id="email"
        label="Edit Email"
        currentValue={user?.email || ""}
        fieldName="email"
        type="email"
        mutate={updateUserMutation}
        isPending={updateUserPending}
      />

      <EditPasswordModal
        isOpen={openModals.password}
        setIsOpen={(isOpen) => toggleModal("password", isOpen)}
        mutate={updateUserMutation}
        isPending={updateUserPending}
      />
    </section>
  );
}
