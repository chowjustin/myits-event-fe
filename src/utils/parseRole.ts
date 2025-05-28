export default function parseRole(role?: string): string {
  if (!role) return "Unknown Role";

  const roleMap: Record<string, string> = {
    user: "Mahasiswa",
    ormawa: "Organisasi",
    departemen: "Departemen",
  };

  return roleMap[role.toLowerCase()] || role;
}
