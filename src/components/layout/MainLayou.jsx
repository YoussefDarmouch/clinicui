import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import Login from "../../features/auth/pages/Login";

export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                <Login />

            </div>

            {/* Footer */}
            <Footer />

        </div>
    );
}