import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    createPatientService,
    getPatientService,
    updatePatientService,
    getUsersService,
} from '../services/admin.service'

const EMPTY_FORM = {
    user_id: '',
    date_naissance: '',
    sexe: 'M',
    numero_securite_sociale: '',
    groupe_sanguin: '',
    allergies: '',
}

export default function PatientForm({ patient: initialPatient, onSuccess, onCancel }) {
    const params = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(params?.id || initialPatient)
    const [formData, setFormData] = useState(EMPTY_FORM)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    const title = isEdit ? 'Modifier un patient' : 'Créer un patient'
    const actionLabel = isEdit ? 'Mettre à jour' : 'Créer'

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsersService()
                const list = response?.data?.data ?? response?.data ?? response
                setUsers(Array.isArray(list) ? list : [])
            } catch (err) {
                setServerError('Impossible de charger la liste des utilisateurs.')
            }
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const hydrateForm = (patient) => {
            setFormData({
                user_id: patient.user_id ?? patient.user?.id ?? '',
                date_naissance: patient.date_naissance ?? '',
                sexe: patient.sexe ?? 'M',
                numero_securite_sociale: patient.numero_securite_sociale ?? '',
                groupe_sanguin: patient.groupe_sanguin ?? '',
                allergies: patient.allergies ?? '',
            })
        }

        if (initialPatient) {
            hydrateForm(initialPatient)
            setLoading(false)
        } else if (params?.id) {
            const fetchPatient = async () => {
                setLoading(true)
                try {
                    const response = await getPatientService(params.id)
                    const payload = response?.data?.data ?? response?.data ?? response
                    hydrateForm(payload)
                } catch (err) {
                    setServerError('Impossible de charger le patient.')
                } finally {
                    setLoading(false)
                }
            }
            fetchPatient()
        } else {
            setLoading(false)
        }
    }, [initialPatient, params?.id])

    const getFieldError = (field) => {
        if (!errors) return undefined
        if (errors[field]) return errors[field][0]
        const wildcardKey = Object.keys(errors).find((key) => key.startsWith(`${field}.`))
        return wildcardKey ? errors[wildcardKey][0] : undefined
    }

    const handleChange = (field) => (event) => {
        setFormData((current) => ({
            ...current,
            [field]: event.target.value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setErrors({})
        setServerError('')

        const payload = {
            user_id: formData.user_id || null,
            date_naissance: formData.date_naissance,
            sexe: formData.sexe,
            numero_securite_sociale: formData.numero_securite_sociale || null,
            groupe_sanguin: formData.groupe_sanguin || null,
            allergies: formData.allergies || null,
        }

        try {
            const response = isEdit
                ? await updatePatientService(params.id || initialPatient.id, payload)
                : await createPatientService(payload)
            const result = response?.data ?? response

            if (onSuccess) {
                onSuccess(result)
            } else {
                navigate('/admin/patients')
            }
        } catch (err) {
            const errorData = err?.response?.data
            if (errorData?.errors) {
                setErrors(errorData.errors)
            } else {
                setServerError(errorData?.message || 'Une erreur est survenue lors de l’enregistrement.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chargement du formulaire patient...</p>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500">Remplissez les informations patient en respectant les règles de validation.</p>
                </div>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                        Annuler
                    </button>
                )}
            </div>

            {serverError && (
                <div className="mb-4 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                    {serverError}
                </div>
            )}

            <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Lien utilisateur</span>
                        <select
                            value={formData.user_id}
                            onChange={handleChange('user_id')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        >
                            <option value="">Aucun</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} — {user.email}
                                </option>
                            ))}
                        </select>
                        {getFieldError('user_id') && <p className="text-xs text-primary-600">{getFieldError('user_id')}</p>}
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Date de naissance</span>
                        <input
                            type="date"
                            value={formData.date_naissance}
                            onChange={handleChange('date_naissance')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        />
                        {getFieldError('date_naissance') && <p className="text-xs text-primary-600">{getFieldError('date_naissance')}</p>}
                    </label>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Sexe</span>
                        <select
                            value={formData.sexe}
                            onChange={handleChange('sexe')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        >
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
                        {getFieldError('sexe') && <p className="text-xs text-primary-600">{getFieldError('sexe')}</p>}
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">N° de sécurité sociale</span>
                        <input
                            type="text"
                            value={formData.numero_securite_sociale}
                            onChange={handleChange('numero_securite_sociale')}
                            placeholder="1234567890123"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        />
                        {getFieldError('numero_securite_sociale') && <p className="text-xs text-primary-600">{getFieldError('numero_securite_sociale')}</p>}
                    </label>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Groupe sanguin</span>
                        <input
                            type="text"
                            value={formData.groupe_sanguin}
                            onChange={handleChange('groupe_sanguin')}
                            placeholder="A+, O-, B+"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        />
                        {getFieldError('groupe_sanguin') && <p className="text-xs text-primary-600">{getFieldError('groupe_sanguin')}</p>}
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Allergies</span>
                        <textarea
                            value={formData.allergies}
                            onChange={handleChange('allergies')}
                            rows={4}
                            placeholder="Liste des allergies"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                        />
                        {getFieldError('allergies') && <p className="text-xs text-primary-600">{getFieldError('allergies')}</p>}
                    </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? 'Enregistrement…' : actionLabel}
                    </button>
                </div>
            </form>
        </div>
    )
}



