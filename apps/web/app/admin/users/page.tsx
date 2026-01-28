"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/AdminTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  orderCount: number;
  esimCount: number;
}

export default function AdminUsersPage() {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/admin/users`, {
          headers: {
            "x-admin-email": user?.primaryEmailAddress?.emailAddress || "",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user, apiUrl]);

  const handleDeleteUser = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete user ${userToDelete.email}?\n\nThis will permanently delete the user and all related data. Users with completed orders cannot be deleted. This action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const res = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": user?.primaryEmailAddress?.emailAddress || "",
        },
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        // Refresh users list
        const updatedUsers = users.filter((u) => u.id !== userId);
        setUsers(updatedUsers);
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const columns = useMemo(() => [
    {
      header: "ID",
      accessor: (row: User) => row.id,
      className: "break-all min-w-[120px] font-mono text-xs font-bold text-gray-700",
    },
    {
      header: "Email",
      accessor: (row: User) => row.email,
      className: "text-black font-medium",
    },
    {
      header: "Name",
      accessor: (row: User) => row.name || "-",
      className: "text-gray-600",
    },
    {
      header: "eSIMs",
      accessor: (row: User) => row.esimCount,
      className: "text-center font-bold text-black",
    },
    {
      header: "Orders",
      accessor: (row: User) => row.orderCount,
      className: "text-center font-bold text-black",
    },
    {
      header: "Created",
      accessor: (row: User) =>
        new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      className: "text-gray-600 font-mono text-xs",
    },
    {
      header: "Actions",
      accessor: () => "",
      render: (row: User) => {
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleDeleteUser(row.id, e)}
              disabled={deletingUserId === row.id}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      className: "text-white w-[80px]",
    },
  ], [deletingUserId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500 font-mono font-bold uppercase">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">Users</h1>
        <p className="text-gray-600 font-mono font-bold uppercase text-sm">
          Manage all platform users
        </p>
      </div>

      <Card className="bg-white border-2 border-black rounded-none shadow-hard overflow-hidden">
        <CardContent className="p-0">
          <AdminTable
            data={users}
            columns={columns}
            onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
