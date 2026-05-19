import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import PatientForm from './PatientForm'
import DossierMedical from './DossierMedical'
import Consultations from './Consultations'
import Ordonnances from './Ordonnances'
import { deletePatientService, getPatientService } from '../services/admin.service'

export default function PatientDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editing, setEditing] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const fetchPatient = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getPatientService(id)
                const payload = response?.data?.data ?? response?.data ?? response
                setPatient(payload)
            } catch (err) {
                setError('Impossible de charger les informations du patient.')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchPatient()
        }
    }, [id])

    const handleDelete = async () => {
        try {
            await deletePatientService(id)
            navigate('/admin/patients')
        } catch (err) {
            window.alert('Suppression échouée.')
        }
    }

    const handleUpdateSuccess = (updatedPatient) => {
        setPatient(updatedPatient)
        setEditing(false)
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chargement des détails patient...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-primary-100 bg-primary-50 p-6 shadow-sm">
                <p className="text-sm text-primary-700">{error}</p>
            </div>
        )
    }

    if (!patient) {
        return null
    }

    const name = patient.user?.name || patient.name || 'Patient'
    const email = patient.user?.email || patient.email || '—'
    const phone = patient.user?.phone || patient.phone || '—'
    const dob = patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString('fr-FR') : '—'

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
                    <p className="mt-2 text-sm text-slate-500">Profil détaillé du patient</p>
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
                        className="rounded-2xl bg-primary-100 px-5 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                    >
                        Supprimer
                    </button>
                    <Link
                        to="/admin/patients"
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </div>

            {editing ? (
                <PatientForm patient={patient} onSuccess={handleUpdateSuccess} onCancel={() => setEditing(false)} />
            ) : (
                <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-700">
                                {name.split(' ').slice(0, 2).map((part) => part[0]).join('')}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Patient</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{name}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Téléphone</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Date de naissance</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{dob}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Sexe</p>
                                <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                                    {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Informations médicales</h2>
                            <div className="mt-6 grid gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">N° de sécurité sociale</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{patient.numero_securite_sociale || 'Non renseigné'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Groupe sanguin</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{patient.groupe_sanguin || 'Non renseigné'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Allergies</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{patient.allergies || 'Aucune information'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Enregistré le</p>
                                    <p className="mt-2 text-base font-medium text-slate-900">{patient.created_at ? new Date(patient.created_at).toLocaleDateString('fr-FR') : '—'}</p>
                                </div>
                            </div>
                        </div>

                        <DossierMedical patientId={id} />
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Consultations patientId={id} />
                            <Ordonnances patientId={id} />
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Confirmer la suppression</h2>
                            <p className="mt-2 text-sm text-slate-500">La suppression de ce patient est irréversible.</p>
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
                                className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700"
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


