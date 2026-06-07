"use client";

import { useState, useEffect } from "react";

import { api } from "@/services/api";

import type { PublicUser, UserRole } from "@/types/user";
import { Eye, Loader, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import CustomRoleDropdown from "../CustomRoleDropdown";
import Link from "next/link";

const AdminUserManagement = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);

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

  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.users.delete(userId);

      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-950/20" />
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-12 border-b border-emerald-950/5">
          <h2 className="text-3xl font-serif font-bold text-emerald-950">
            User Management
          </h2>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="w-[45%] px-12 py-8">User</th>
                <th className="w-[30%] px-12 py-8">Phone</th>
                <th className="w-[20%] px-12 py-8 text-center">Role</th>
                <th className="w-[15%] px-12 py-8 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              {users.map((u, index) => (
                <tr
                  key={u._id}
                  className="group hover:bg-emerald-700/5 transition-colors cursor-pointer"
                >
                  <td className="px-12 py-8">
                    <Link href={`/profile/${u._id}`}>
                      <div className="flex items-center gap-4">
                        {u.avatar ? (
                          <Image
                            src={u.avatar}
                            alt={u.firstName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-950/5 flex items-center justify-center text-emerald-950 font-bold">
                            {u.firstName[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-emerald-950">
                            {u.firstName} {u.surname}
                          </div>
                          <div className="text-xs text-emerald-950/40">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-12 py-8">
                    {u.phone ? (
                      <span className="text-emerald-950 font-medium">
                        {u.phone}
                      </span>
                    ) : (
                      <span className="italic text-emerald-950/40">
                        Not Provided
                      </span>
                    )}
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center justify-center">
                      <CustomRoleDropdown
                        value={u.role}
                        onChange={(role) => handleRoleUpdate(u._id, role)}
                        openUp={index >= users.length - 2}
                      />
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="w-10 h-10 rounded-lg hover:bg-emerald-950/5 cursor-pointer text-emerald-950/60 hover:text-emerald-950 transition-all"
                      >
                        <Eye className="w-5 h-5 mx-auto" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="w-10 h-10 rounded-lg hover:bg-red-100 cursor-pointer text-red-500 transition-all"
                      >
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-4xl w-full max-w-2xl p-12 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-serif font-bold text-emerald-950">
                  User Profile
                </h3>

                <p className="text-emerald-950/40 text-sm">
                  Detailed account information
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-10 h-10 rounded-xl hover:bg-emerald-950/5 flex items-center justify-center text-emerald-950/60 hover:text-emerald-950 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-5 mb-8">
              {selectedUser.avatar ? (
                <Image
                  src={selectedUser.avatar}
                  alt={`${selectedUser.firstName} ${selectedUser.surname}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border border-emerald-950/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-950/5 flex items-center justify-center text-2xl font-bold text-emerald-950 border border-emerald-950/10">
                  {selectedUser.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              <div>
                <h4 className="text-2xl font-bold text-emerald-950">
                  {selectedUser.firstName} {selectedUser.surname}
                </h4>

                <p className="text-emerald-950/50">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-emerald-950/40">
                  Phone
                </label>

                <p className="font-medium text-emerald-950">
                  {selectedUser.phone || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-emerald-950/40">
                  School
                </label>

                <p className="font-medium text-emerald-950">
                  {selectedUser.school || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-emerald-950/40">
                  User ID
                </label>

                <p className="font-mono text-sm text-emerald-950">
                  {selectedUser._id}
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-emerald-950/40">
                  Joined
                </label>

                <p className="font-medium text-emerald-950">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 w-full">
              <Link
                href={`/profile/${selectedUser._id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/10 text-emerald-950 font-medium hover:bg-emerald-950/10 transition-all"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </Link>

              <Link
                href={`/profile/${selectedUser._id}/edit`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/90 text-white font-medium hover:bg-emerald-900 transition-all"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {selectedUser.bio && (
              <div className="mt-8">
                <label className="text-xs uppercase tracking-widest text-emerald-950/40">
                  Bio
                </label>

                <p className="mt-2 text-emerald-950/70 leading-relaxed">
                  {selectedUser.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserManagement;
