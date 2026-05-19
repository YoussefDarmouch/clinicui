import Sidebar from "./Sidebar";
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col bg-gray-50">
                <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl shadow-sm">
                    <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Espace admin</p>
                            <h1 className="text-xl font-semibold text-slate-900">Administration clinique</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link to="/" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                                Accueil
                            </Link>
                            <Link to="/admin/profile" className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
                                Profil
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

