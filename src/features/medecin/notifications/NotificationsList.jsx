import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { NotificationService } from "../services/medecin.services";
import { parseError, resolveArray } from "../pages/page.utils";

export default function NotificationsList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await NotificationService.getAll();
            setRows(resolveArray(response));
        } catch (err) {
            setError(parseError(err, "Impossible de charger les notifications."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows();
    }, []);

    const markAsRead = async (id) => {
        try {
            await NotificationService.markAsRead(id);
            await fetchRows();
        } catch (err) {
            setError(parseError(err, "Impossible de marquer la notification comme lue."));
        }
    };

    if (loading) return <LoadingSpinner text="Chargement des notifications..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
            </div>

            {error ? (
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            {rows.length === 0 ? (
                <EmptyState title="Aucune notification" description="Tout est à jour." />
            ) : (
                <div className="space-y-3">
                    {rows.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">{item.title || "Notification"}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.message || item.content || "—"}
                                    </p>
                                </div>
                                {!item.read_at ? (
                                    <button
                                        type="button"
                                        onClick={() => markAsRead(item.id)}
                                        className="rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white"
                                    >
                                        Marquer comme lu
                                    </button>
                                ) : (
                                    <span className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700">
                                        Lu
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
