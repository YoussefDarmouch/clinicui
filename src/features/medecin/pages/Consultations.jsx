import { useEffect, useMemo, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import {
    createConsultationService,
    createOrdonnanceService,
    deleteConsultationService,
    getAvailableRendezVousService,
    getConsultationsService,
    updateConsultationService,
} from '../services/medecin.service'
import {
    formatDate,
    getInitials,
    getStatusBadgeClass,
    normalizeString,
    PAGE_SIZE,
    safeContains,
    toArray,
} from './page.utils'

const EMPTY_CONSULTATION_FORM = {
    rendezvous_id: '',
    diagnostic: '',
    traitement: '',
    notes: '',
    poids: '',
    tension: '',
    temperature: '',
}

const getEmptyOrdonnanceForm = () => ({
    valid_until: '',
    instructions: '',
    medicaments: [
        {
            id: '',
            dose: '',
            frequency: '',
            duration_days: '',
        },
    ],
})

const toOptionalNumber = (value) => {
    if (value === '' || value === null || value === undefined) return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
}

const getRendezVousLabel = (item) => {
    const patientName = item?.patient_name ?? item?.patient?.name ?? item?.patient?.user?.name ?? `Patient #${item?.patient_id ?? '?'}`
    const dateValue = item?.date_heure ?? item?.scheduled_at ?? item?.date ?? item?.created_at
    const dateLabel = formatDate(dateValue, true)
    return `${patientName} - ${dateLabel}`
}

export default function Consultations() {
    const [consultations, setConsultations] = useState([])
    const [availableRendezVous, setAvailableRendezVous] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingRendezVous, setLoadingRendezVous] = useState(true)
    const [error, setError] = useState(null)
    const [rendezVousError, setRendezVousError] = useState(null)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const [consultationModalOpen, setConsultationModalOpen] = useState(false)
    const [ordonnanceModalOpen, setOrdonnanceModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [editingConsultation, setEditingConsultation] = useState(null)
    const [selectedConsultation, setSelectedConsultation] = useState(null)

    const [consultationForm, setConsultationForm] = useState(EMPTY_CONSULTATION_FORM)
    const [ordonnanceForm, setOrdonnanceForm] = useState(getEmptyOrdonnanceForm())

    const [submittingConsultation, setSubmittingConsultation] = useState(false)
    const [submittingOrdonnance, setSubmittingOrdonnance] = useState(false)
    const [submittingDelete, setSubmittingDelete] = useState(false)

    const [formError, setFormError] = useState('')

    const fetchConsultations = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getConsultationsService()
            setConsultations(toArray(response))
        } catch (err) {
            setError('Impossible de recuperer les consultations.')
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableRendezVous = async () => {
        setLoadingRendezVous(true)
        setRendezVousError(null)
        try {
            const response = await getAvailableRendezVousService()
            setAvailableRendezVous(toArray(response))
        } catch (err) {
            setRendezVousError('Impossible de charger les rendez-vous disponibles.')
            setAvailableRendezVous([])
        } finally {
            setLoadingRendezVous(false)
        }
    }

    useEffect(() => {
        fetchConsultations()
        fetchAvailableRendezVous()
    }, [])

    const filteredConsultations = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return consultations

        return consultations.filter((consultation) =>
            [
                consultation?.id,
                consultation?.rendezvous_id,
                consultation?.patient_name,
                consultation?.patient?.name,
                consultation?.diagnostic,
                consultation?.traitement,
                consultation?.notes,
                consultation?.tension,
                consultation?.temperature,
                consultation?.date_consultation,
                consultation?.statut,
                consultation?.status,
            ].some((field) => safeContains(field, normalized))
        )
    }, [query, consultations])

    const pageCount = Math.max(1, Math.ceil(filteredConsultations.length / PAGE_SIZE))
    const visibleConsultations = filteredConsultations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const openCreateConsultationModal = () => {
        setFormError('')
        setEditingConsultation(null)
        setConsultationForm(EMPTY_CONSULTATION_FORM)
        setConsultationModalOpen(true)
    }

    const openEditConsultationModal = (consultation) => {
        setFormError('')
        setEditingConsultation(consultation)
        setConsultationForm({
            rendezvous_id: consultation?.rendezvous_id ?? '',
            diagnostic: consultation?.diagnostic ?? '',
            traitement: consultation?.traitement ?? '',
            notes: consultation?.notes ?? consultation?.details?.notes ?? '',
            poids: consultation?.poids ?? consultation?.details?.poids ?? '',
            tension: consultation?.tension ?? consultation?.details?.tension ?? '',
            temperature: consultation?.temperature ?? consultation?.details?.temperature ?? '',
        })
        setConsultationModalOpen(true)
    }

    const openCreateOrdonnanceModal = (consultation) => {
        setFormError('')
        setSelectedConsultation(consultation)
        setOrdonnanceForm(getEmptyOrdonnanceForm())
        setOrdonnanceModalOpen(true)
    }

    const openDeleteModal = (consultation) => {
        setFormError('')
        setSelectedConsultation(consultation)
        setDeleteModalOpen(true)
    }

    const closeConsultationModal = () => {
        setConsultationModalOpen(false)
        setEditingConsultation(null)
        setConsultationForm(EMPTY_CONSULTATION_FORM)
    }

    const closeOrdonnanceModal = () => {
        setOrdonnanceModalOpen(false)
        setOrdonnanceForm(getEmptyOrdonnanceForm())
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedConsultation(null)
    }

    const handleConsultationChange = (field) => (event) => {
        setConsultationForm((current) => ({
            ...current,
            [field]: event.target.value,
        }))
    }

    const handleOrdonnanceChange = (field) => (event) => {
        setOrdonnanceForm((current) => ({
            ...current,
            [field]: event.target.value,
        }))
    }

    const handleMedicamentChange = (index, field) => (event) => {
        const value = event.target.value
        setOrdonnanceForm((current) => ({
            ...current,
            medicaments: current.medicaments.map((medicament, currentIndex) =>
                currentIndex === index
                    ? { ...medicament, [field]: value }
                    : medicament
            ),
        }))
    }

    const addMedicamentRow = () => {
        setOrdonnanceForm((current) => ({
            ...current,
            medicaments: [
                ...current.medicaments,
                { id: '', dose: '', frequency: '', duration_days: '' },
            ],
        }))
    }

    const removeMedicamentRow = (index) => {
        setOrdonnanceForm((current) => {
            if (current.medicaments.length <= 1) return current
            return {
                ...current,
                medicaments: current.medicaments.filter((_, currentIndex) => currentIndex !== index),
            }
        })
    }

    const handleConsultationSubmit = async (event) => {
        event.preventDefault()
        setSubmittingConsultation(true)
        setFormError('')

        const rendezVousId = toOptionalNumber(consultationForm.rendezvous_id)
        if (!rendezVousId) {
            setFormError('Veuillez selectionner un rendez-vous depuis la liste.')
            setSubmittingConsultation(false)
            return
        }

        const payload = {
            // rendezvous_id is selected implicitly from dropdown option value (no manual ID typing).
            rendezvous_id: rendezVousId,
            diagnostic: consultationForm.diagnostic || null,
            traitement: consultationForm.traitement || null,
            notes: consultationForm.notes || null,
            poids: toOptionalNumber(consultationForm.poids),
            tension: consultationForm.tension || null,
            temperature: toOptionalNumber(consultationForm.temperature),
        }

        try {
            if (editingConsultation?.id) {
                await updateConsultationService(editingConsultation.id, payload)
            } else {
                await createConsultationService(payload)
            }
            closeConsultationModal()
            await fetchConsultations()
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Impossible d enregistrer la consultation.')
        } finally {
            setSubmittingConsultation(false)
        }
    }

    const handleOrdonnanceSubmit = async (event) => {
        event.preventDefault()
        setSubmittingOrdonnance(true)
        setFormError('')

        if (!selectedConsultation?.id) {
            setFormError('Consultation invalide pour la creation de l ordonnance.')
            setSubmittingOrdonnance(false)
            return
        }

        const payload = {
            valid_until: ordonnanceForm.valid_until || null,
            instructions: ordonnanceForm.instructions || '',
            medicaments: (ordonnanceForm.medicaments || []).map((medicament) => ({
                id: toOptionalNumber(medicament.id),
                dose: medicament.dose || '',
                frequency: medicament.frequency || '',
                duration_days: toOptionalNumber(medicament.duration_days),
            })),
        }

        try {
            await createOrdonnanceService(selectedConsultation.id, payload)
            closeOrdonnanceModal()
            await fetchConsultations()
        } catch (err) {
            setFormError(err?.response?.data?.message || err?.message || 'Impossible de creer l ordonnance.')
        } finally {
            setSubmittingOrdonnance(false)
        }
    }

    const handleDeleteConsultation = async () => {
        if (!selectedConsultation?.id) return

        setSubmittingDelete(true)
        setFormError('')

        try {
            await deleteConsultationService(selectedConsultation.id)
            closeDeleteModal()
            await fetchConsultations()
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Impossible de supprimer la consultation.')
        } finally {
            setSubmittingDelete(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Consultations</h1>
                        <p className="mt-2 text-sm text-slate-500">CRUD consultations + creation d ordonnances.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Rechercher une consultation..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 sm:w-72"
                        />
                        <button
                            type="button"
                            onClick={openCreateConsultationModal}
                            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                            Nouvelle consultation
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des consultations...</p>
                ) : error ? (
                    <p className="text-sm text-primary-600">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Patient</th>
                                        <th className="px-4 py-4 font-semibold">Diagnostic</th>
                                        <th className="px-4 py-4 font-semibold">Traitement</th>
                                        <th className="px-4 py-4 font-semibold">Temperature</th>
                                        <th className="px-4 py-4 font-semibold">Tension</th>
                                        <th className="px-4 py-4 font-semibold">Date</th>
                                        <th className="px-4 py-4 font-semibold">Statut</th>
                                        <th className="px-4 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {visibleConsultations.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-6 text-center text-sm text-slate-500">
                                                Aucune consultation trouvee.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleConsultations.map((consultation) => {
                                            const patientName = consultation?.patient_name ?? consultation?.patient?.name ?? consultation?.patient
                                            const temperature = consultation?.temperature ?? consultation?.details?.temperature
                                            const tension = consultation?.tension ?? consultation?.details?.tension
                                            return (
                                                <tr key={consultation.id} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                                                                {getInitials(patientName)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{normalizeString(patientName)}</p>
                                                                <p className="text-xs text-slate-500">ID: {normalizeString(consultation?.id)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">{normalizeString(consultation?.diagnostic)}</td>
                                                    <td className="px-4 py-4">{normalizeString(consultation?.traitement)}</td>
                                                    <td className="px-4 py-4">{normalizeString(temperature)}</td>
                                                    <td className="px-4 py-4">{normalizeString(tension)}</td>
                                                    <td className="px-4 py-4">{formatDate(consultation?.date_consultation ?? consultation?.created_at, true)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(consultation?.statut ?? consultation?.status)}`}>
                                                            {normalizeString(consultation?.statut ?? consultation?.status, 'inconnu')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditConsultationModal(consultation)}
                                                                className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openCreateOrdonnanceModal(consultation)}
                                                                className="rounded-2xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700"
                                                            >
                                                                Ordonnance
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteModal(consultation)}
                                                                className="rounded-2xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Affichage de {visibleConsultations.length} sur {filteredConsultations.length} consultations
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                                    disabled={page === 1}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Precedent
                                </button>
                                <span className="text-sm text-slate-500">Page {page} / {pageCount}</span>
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
                                    disabled={page === pageCount}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Modal isOpen={consultationModalOpen} onClose={closeConsultationModal}>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {editingConsultation ? 'Modifier la consultation' : 'Nouvelle consultation'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">Remplissez les champs de la consultation.</p>
                    </div>

                    {formError && (
                        <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                            {formError}
                        </div>
                    )}

                    {rendezVousError && (
                        <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                            {rendezVousError}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleConsultationSubmit}>
                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">rendezvous_id</span>
                            <select
                                value={consultationForm.rendezvous_id}
                                onChange={handleConsultationChange('rendezvous_id')}
                                disabled={loadingRendezVous}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="">
                                    {loadingRendezVous ? 'Chargement des rendez-vous...' : 'Selectionner un rendez-vous'}
                                </option>
                                {availableRendezVous.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {getRendezVousLabel(item)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">diagnostic</span>
                            <input
                                type="text"
                                value={consultationForm.diagnostic}
                                onChange={handleConsultationChange('diagnostic')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                            />
                        </label>

                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">traitement</span>
                            <input
                                type="text"
                                value={consultationForm.traitement}
                                onChange={handleConsultationChange('traitement')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                            />
                        </label>

                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">notes</span>
                            <textarea
                                value={consultationForm.notes}
                                onChange={handleConsultationChange('notes')}
                                rows={3}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">poids</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={consultationForm.poids}
                                    onChange={handleConsultationChange('poids')}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">tension</span>
                                <input
                                    type="text"
                                    value={consultationForm.tension}
                                    onChange={handleConsultationChange('tension')}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">temperature</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={consultationForm.temperature}
                                    onChange={handleConsultationChange('temperature')}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                />
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeConsultationModal}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submittingConsultation || loadingRendezVous}
                                className="rounded-2xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submittingConsultation ? 'Enregistrement...' : editingConsultation ? 'Mettre a jour' : 'Creer'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={ordonnanceModalOpen} onClose={closeOrdonnanceModal}>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Creer une ordonnance</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            consultation_id: {selectedConsultation?.id ?? '—'}
                        </p>
                    </div>

                    {formError && (
                        <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                            {formError}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleOrdonnanceSubmit}>
                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">valid_until</span>
                            <input
                                type="datetime-local"
                                value={ordonnanceForm.valid_until}
                                onChange={handleOrdonnanceChange('valid_until')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                            />
                        </label>

                        <label className="space-y-1 block">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">instructions</span>
                            <textarea
                                value={ordonnanceForm.instructions}
                                onChange={handleOrdonnanceChange('instructions')}
                                rows={3}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                            />
                        </label>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">medicaments</span>
                                <button
                                    type="button"
                                    onClick={addMedicamentRow}
                                    className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                >
                                    Ajouter
                                </button>
                            </div>

                            {ordonnanceForm.medicaments.map((medicament, index) => (
                                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <label className="space-y-1">
                                            <span className="text-xs text-slate-500">id</span>
                                            <input
                                                type="number"
                                                value={medicament.id}
                                                onChange={handleMedicamentChange(index, 'id')}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                            />
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-xs text-slate-500">dose</span>
                                            <input
                                                type="text"
                                                value={medicament.dose}
                                                onChange={handleMedicamentChange(index, 'dose')}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                            />
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-xs text-slate-500">frequency</span>
                                            <input
                                                type="text"
                                                value={medicament.frequency}
                                                onChange={handleMedicamentChange(index, 'frequency')}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                            />
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-xs text-slate-500">duration_days</span>
                                            <input
                                                type="number"
                                                value={medicament.duration_days}
                                                onChange={handleMedicamentChange(index, 'duration_days')}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeMedicamentRow(index)}
                                            className="rounded-2xl bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeOrdonnanceModal}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submittingOrdonnance}
                                className="rounded-2xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submittingOrdonnance ? 'Creation...' : 'Creer ordonnance'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal}>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Supprimer la consultation</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Cette action est irreversible. Consultation ID: {selectedConsultation?.id ?? '—'}
                        </p>
                    </div>

                    {formError && (
                        <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                            {formError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteConsultation}
                            disabled={submittingDelete}
                            className="rounded-2xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submittingDelete ? 'Suppression...' : 'Supprimer'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
