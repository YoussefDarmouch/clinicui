import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { RendezVousService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

export default function RendezVousDetails() {
    const { id } = useParams();
    const [rendezvous, setRendezvous] = useState(null);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const [rdvRes, patientRes] = await Promise.all([
                    RendezVousService.getById(id),
                    RendezVousService.getPatient(id),
                ]);
                setRendezvous(resolveData(rdvRes));
                setPatient(resolveData(patientRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger le rendez-vous."));
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <LoadingSpinner text="Chargement du rendez-vous..." />;
    if (error) {
        return <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">{error}</div>;
    }
    if (!rendezvous) return <EmptyState title="Rendez-vous introuvable" />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Détails Rendez-vous #{rendezvous.id}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {rendezvous.date_heure
                                ? new Date(rendezvous.date_heure).toLocaleString("fr-FR")
                                : "Date non définie"}
                        </p>
                    </div>
                    <Link
                        to="/medecin/rendezvous"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Retour
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Rendez-vous</h2>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>Statut: <span className="font-semibold">{rendezvous.statut || rendezvous.status || "—"}</span></p>
                        <p>Motif: {rendezvous.motif || "—"}</p>
                        <p>Notes: {rendezvous.notes || "—"}</p>
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Patient lié</h2>
                    {patient ? (
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <p>Nom: <span className="font-semibold text-slate-900">{patient.user?.name || patient.name || "—"}</span></p>
                            <p>Email: {patient.user?.email || patient.email || "—"}</p>
                            <p>Téléphone: {patient.user?.phone || patient.phone || "—"}</p>
                            <Link
                                to={`/medecin/patients/${patient.id}`}
                                className="inline-flex rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white"
                            >
                                Voir dossier patient
                            </Link>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-slate-500">Aucune information patient.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
