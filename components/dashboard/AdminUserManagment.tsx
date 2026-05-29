"use client";

import { useState, useEffect } from "react";

import { api } from "@/services/api";

import type { PublicUser, UserRole } from "@/types/user";
import { Loader } from "lucide-react";

const AdminUserManagement = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await api.users.listAll();
      setUsers(data);
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      await api.users.updateRole(userId, newRole);
      fetchUsers(); // Refresh
    } catch (error: unknown) {
      console.error("Failed to update role:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-950/20" />
      </div>
    );

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
      <div className="p-10 md:p-12 border-b border-emerald-950/5">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          User Management
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="px-12 py-8">User</th>
              <th className="px-12 py-8">Role</th>
              <th className="px-12 py-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/5">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-emerald-950/1 transition-all">
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-950/5 flex items-center justify-center text-emerald-950 font-bold">
                      {u.firstName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-emerald-950">
                        {u.firstName} {u.surname}
                      </div>
                      <div className="text-xs text-emerald-950/40">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-8">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      u.role === "Admin"
                        ? "bg-purple-100 text-purple-600"
                        : u.role === "Editor"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-12 py-8">
                  <select
                    className="bg-emerald-950/5 border-none rounded-lg py-2 px-4 text-xs font-bold outline-none"
                    value={u.role}
                    onChange={(e) =>
                      handleRoleUpdate(u._id, e.target.value as UserRole)
                    }
                  >
                    <option value="Author">Author</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
