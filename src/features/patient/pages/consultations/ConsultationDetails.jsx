import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getConsultationService } from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function ConsultationDetails() {
    const { id } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getConsultationService(id);
                setConsultation(resolveData(response));
            } catch (err) {
                setError(parseError(err, "Impossible de charger la consultation."));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <LoadingSpinner text="Chargement de la consultation..." />;
    if (!consultation) return <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">Consultation introuvable.</div>;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Consultation #{consultation.id}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {consultation.date_consultation ? new Date(consultation.date_consultation).toLocaleString("fr-FR") : "Date non définie"}
                        </p>
                    </div>
                    <Link to="/patient/consultations" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Retour
                    </Link>
                </div>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Détails</h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Diagnostic: {consultation.diagnostic || "—"}</p>
                    <p>Traitement: {consultation.traitement || "—"}</p>
                    <p>Notes: {consultation.notes || "—"}</p>
                </div>
            </div>
        </div>
    );
}
