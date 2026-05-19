import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import MedecinForm from './MedecinForm'
import Consultations from './Consultations'
import RendezVous from './RendezVous'
import {
    deleteMedecinService,
    getMedecinService,
} from '../services/admin.service'

export default function MedecinDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [medecin, setMedecin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editing, setEditing] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const fetchMedecin = async () => {
            setLoading(true)
            try {
                const response = await getMedecinService(id)
                const payload = response?.data?.data ?? response?.data ?? response
                setMedecin(payload)
            } catch (err) {
                setError('Impossible de charger le médecin.')
            } finally {
                setLoading(false)
            }
        }

        fetchMedecin()
    }, [id])

    const handleDelete = async () => {
        try {
            await deleteMedecinService(id)
            navigate('/admin/medecins')
        } catch (err) {
            window.alert('Suppression échouée.')
        }
    }

    const handleUpdateSuccess = (updatedMedecin) => {
        setMedecin(updatedMedecin)
        setEditing(false)
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chargement des détails médecin...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                <p className="text-sm text-rose-700">{error}</p>
            </div>
        )
    }

    if (!medecin) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{medecin.user?.name || 'Médecin'}</h1>
                    <p className="mt-2 text-sm text-slate-500">Profil détaillé du médecin</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setEditing((current) => !current)}
                        className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        {editing ? 'Annuler' : 'Modifier'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="rounded-2xl bg-rose-100 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                        Supprimer
                    </button>
                    <Link
                        to="/admin/medecins"
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </div>

            {editing ? (
                <MedecinForm medecin={medecin} onSuccess={handleUpdateSuccess} onCancel={() => setEditing(false)} />
            ) : (
                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex justify-center -mt-12">
                            <img
                                src={
                                    medecin.image_medecin
                                        ? `http://127.0.0.1:8000/${medecin.image_medecin}`
                                        : "/default-doctor.png"
                                }
                                alt={medecin.user?.name}
                                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                            />
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="text-sm text-slate-500">Nom</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{medecin.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{medecin.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Licence</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{medecin.numero_licence}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Spécialité</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{medecin.specialite?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Années d’expérience</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{medecin.annees_experience ?? '—'} ans</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Statut</p>
                                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${medecin.user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {medecin.user.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Informations de compte</h2>
                            <div className="mt-6 grid gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Identifiant utilisateur</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{medecin.user?.id || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Téléphone</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{medecin.user?.phone || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Adresse</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{medecin.user?.address || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Créé le</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{medecin.created_at ? new Date(medecin.created_at).toLocaleDateString('fr-FR') : '—'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <Consultations medecinId={id} />
                            <RendezVous medecinId={id} />
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Confirmer la suppression</h2>
                            <p className="mt-2 text-sm text-slate-500">Vous êtes sur le point de supprimer ce médecin. Cette action est irréversible.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
