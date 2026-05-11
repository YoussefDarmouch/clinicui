import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex">

            {/* Sidebar ثابت */}
            <Sidebar />

            {/* Content كيتبدل هنا */}
            <main className="flex-1 p-6 bg-gray-50 min-h-screen">
                <Outlet />
            </main>

        </div>
    );
}