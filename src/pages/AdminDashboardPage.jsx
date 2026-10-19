import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

function StatCard({ title, value, description }) {
return (
<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<p className="text-sm font-medium text-gray-500">{title}</p>
<p className="mt-3 text-3xl font-bold text-gray-900">
{value ?? 0}
</p>
<p className="mt-2 text-sm text-gray-500">{description}</p>
</div>
);
}

export default function AdminDashboardPage() {
const {
data: stats,
isLoading,
isError,
error,
refetch,
} = useQuery({
queryKey: ['admin-dashboard'],
queryFn: async () => {
const response = await apiClient.get('/admin/dashboard');

  // Supports the backend's { success, data } response format.
  return response.data.data ?? response.data;
},

});

if (isLoading) {
return (
<main className="mx-auto max-w-7xl p-6">
<p className="text-gray-600">Loading administrator dashboard...</p>
</main>
);
}

if (isError) {
return (
<main className="mx-auto max-w-7xl p-6">
<h1 className="text-2xl font-bold text-gray-900">
Administrator Dashboard
</h1>

    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="font-medium text-red-700">
        Unable to load dashboard statistics.
      </p>
      <p className="mt-2 text-sm text-red-600">
        {error?.response?.data?.message ||
          error?.message ||
          'Please check your connection and administrator permissions.'}
      </p>

      <button
        type="button"
        onClick={() => refetch()}
        className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
      >
        Try Again
      </button>
    </div>
  </main>
);

}

return (
<main className="mx-auto max-w-7xl p-6">
<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
<div>
<p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
CampusNest Malawi
</p>
<h1 className="mt-2 text-3xl font-bold text-gray-900">
Administrator Dashboard
</h1>
<p className="mt-2 text-gray-600">
Monitor registered users and manage platform accounts.
</p>
</div>

    <button
      type="button"
      onClick={() => refetch()}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
    >
      Refresh Statistics
    </button>
  </div>

  <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <StatCard
      title="Total Users"
      value={stats?.totalUsers}
      description="All registered platform accounts"
    />

    <StatCard
      title="Active Users"
      value={stats?.activeUsers}
      description="Accounts currently active"
    />

    <StatCard
      title="Inactive Users"
      value={stats?.inactiveUsers}
      description="Accounts currently deactivated"
    />

    <StatCard
      title="Students"
      value={stats?.students}
      description="Registered student accounts"
    />

    <StatCard
      title="Landlords"
      value={stats?.landlords}
      description="Registered landlord accounts"
    />

    <StatCard
      title="Administrators"
      value={stats?.administrators}
      description="Accounts with administrative roles"
    />
  </section>

  <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-900">
      Platform Management
    </h2>

    <p className="mt-2 text-sm leading-6 text-gray-600">
      Use the administration tools to review user accounts, manage access
      permissions, and inspect audit logs of administrative actions.
    </p>

    <p className="mt-3 text-sm text-gray-500">
      User management and audit log pages will be connected in the next
      implementation steps.
    </p>
  </section>
</main>

);
}