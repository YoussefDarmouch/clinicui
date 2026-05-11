import React, { useEffect, useState } from "react";
import {

    getUserStatsService,
    getDashboardStatsService,
} from "../services/admin.service";


export default function Dashboard() {
    const [userStats, setUserStats] = useState(null);

    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUserStatsService();
                const dashboard = await getDashboardStatsService();



                setUserStats(users.data);
                setDashboardStats(dashboard.data);

                console.log("users:", users.data);
                console.log("dashboard:", dashboard.data);


            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ADMINS */}
            <div className="bg-blue-500 text-white p-4 rounded-xl">
                <h2>Total Admins</h2>
                <p className="text-2xl font-bold">
                    {dashboardStats?.total_admins || 0}
                </p>
            </div>

            {/* MEDECINS */}
            <div className="bg-green-500 text-white p-4 rounded-xl">
                <h2>Total Medecins</h2>
                <p className="text-2xl font-bold">
                    {dashboardStats?.total_medecins || 0}
                </p>
            </div>

            {/* PATIENTS */}
            <div className="bg-purple-500 text-white p-4 rounded-xl">
                <h2>Total Patients</h2>
                <p className="text-2xl font-bold">
                    {dashboardStats?.total_patients || 0}
                </p>
            </div>

            {/* CONSULTATIONS */}
            <div className="bg-red-500 text-white p-4 rounded-xl">
                <h2>Total Consultations</h2>
                <p className="text-2xl font-bold">
                    {dashboardStats?.total_consultations || 0}
                </p>
            </div>

            {/* RENDEZVOUS */}
            <div className="bg-yellow-500 text-white p-4 rounded-xl">
                <h2>Total RendezVous</h2>
                <p className="text-2xl font-bold">
                    {dashboardStats?.total_rendezvous || 0}
                </p>
            </div>

            {/* USERS BY ROLE */}
            <div className="md:col-span-3 bg-white p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">
                    Users By Role
                </h2>

                {userStats?.by_role?.map((role, index) => (
                    <div
                        key={index}
                        className="flex justify-between border-b py-2"
                    >
                        <span>{role.role}</span>
                        <span>{role.count}</span>
                    </div>
                ))}
            </div>

            {/* RECENT USERS */}
            <div className="md:col-span-3 bg-white p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">
                    Recent Users
                </h2>

                {userStats?.recent_users?.map((user) => (
                    <div
                        key={user.id}
                        className="border-b py-2"
                    >
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-gray-500 text-sm">
                            {user.email}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}