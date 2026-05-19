import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    createMedecinService,
    getMedecinService,
    updateMedecinService,
    getUsersService,
    getSpecialitesService,
} from '../services/admin.service'

const EMPTY_FORM = {
    user_id: '',
    specialite_id: '',
    numero_licence: '',
    annees_experience: '',
    image_medecin: '',
}

export default function MedecinForm({ medecin: initialMedecin, onSuccess, onCancel }) {
    const params = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState(EMPTY_FORM)
    const [users, setUsers] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    const isEdit = Boolean(params?.id || initialMedecin)
    const title = isEdit ? 'Modifier un médecin' : 'Créer un médecin'
    const actionLabel = isEdit ? 'Mettre à jour' : 'Créer'

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [usersResponse, specialitesResponse] = await Promise.all([
                    getUsersService(),
                    getSpecialitesService(),
                ])
                setUsers(usersResponse?.data?.data ?? usersResponse?.data ?? usersResponse ?? [])
                setSpecialities(specialitesResponse?.data?.data ?? specialitesResponse?.data ?? specialitesResponse ?? [])
            } catch (err) {
                setServerError('Impossible de charger les options du formulaire.')
            }
        }

        fetchMeta()
    }, [])

    useEffect(() => {
        const resetForm = (medecin) => {
            setFormData({
                user_id: medecin.user?.id ?? medecin.user_id ?? '',
                specialite_id: medecin.specialite?.id ?? medecin.specialite_id ?? '',
                numero_licence: medecin.numero_licence ?? '',
                annees_experience: medecin.annees_experience ?? '',
                image_medecin: medecin.image_medecin ?? '',
            })
        }

        if (initialMedecin) {
            resetForm(initialMedecin)
            setLoading(false)
        } else if (params?.id) {
            const fetchMedecin = async () => {
                setLoading(true)
                try {
                    const response = await getMedecinService(params.id)
                    const medecin = response?.data?.data ?? response?.data ?? response
                    resetForm(medecin)
                } catch (err) {
                    setServerError('Impossible de charger le médecin.')
                } finally {
                    setLoading(false)
                }
            }
            fetchMedecin()
        } else {
            setLoading(false)
        }
    }, [initialMedecin, params?.id])

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
            user_id: formData.user_id,
            specialite_id: formData.specialite_id,
            numero_licence: formData.numero_licence,
            annees_experience: formData.annees_experience === '' ? null : Number(formData.annees_experience),
            image_medecin: formData.image_medecin || null,
        }

        try {
            const response = isEdit
                ? await updateMedecinService(params.id || initialMedecin.id, payload)
                : await createMedecinService(payload)
            const result = response?.data ?? response

            if (onSuccess) {
                onSuccess(result)
            } else {
                navigate('/admin/medecins')
            }
        } catch (err) {
            const errorData = err?.response?.data
            if (errorData?.errors) {
                setErrors(errorData.errors)
            } else {
                setServerError(errorData?.message || 'Impossible d’enregistrer le médecin.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const userOptions = useMemo(() => users, [users])
    const specialityOptions = useMemo(() => specialities, [specialities])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chargement du formulaire médecin...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                        <p className="mt-2 text-sm text-slate-500">Remplissez les informations du médecin en respectant le format de validation.</p>
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
                    <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {serverError}
                    </div>
                )}

                <form className="grid gap-6" onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Compte utilisateur</span>
                            <select
                                value={formData.user_id}
                                onChange={handleChange('user_id')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            >
                                <option value="">Sélectionner un utilisateur</option>
                                {userOptions.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} — {user.email}
                                    </option>
                                ))}
                            </select>
                            {getFieldError('user_id') && <p className="text-xs text-rose-600">{getFieldError('user_id')}</p>}
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Spécialité</span>
                            <select
                                value={formData.specialite_id}
                                onChange={handleChange('specialite_id')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            >
                                <option value="">Sélectionner une spécialité</option>
                                {specialityOptions.map((specialite) => (
                                    <option key={specialite.id} value={specialite.id}>
                                        {specialite.name}
                                    </option>
                                ))}
                            </select>
                            {getFieldError('specialite_id') && <p className="text-xs text-rose-600">{getFieldError('specialite_id')}</p>}
                        </label>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Numéro de licence</span>
                            <input
                                type="text"
                                value={formData.numero_licence}
                                onChange={handleChange('numero_licence')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('numero_licence') && <p className="text-xs text-rose-600">{getFieldError('numero_licence')}</p>}
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Années d’expérience</span>
                            <input
                                type="number"
                                min="0"
                                value={formData.annees_experience}
                                onChange={handleChange('annees_experience')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('annees_experience') && <p className="text-xs text-rose-600">{getFieldError('annees_experience')}</p>}
                        </label>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">URL de l’image du médecin</span>
                            <input
                                type="text"
                                value={formData.image_medecin}
                                onChange={handleChange('image_medecin')}
                                placeholder="https://..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('image_medecin') && <p className="text-xs text-rose-600">{getFieldError('image_medecin')}</p>}
                        </label>

                        {formData.image_medecin && (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-2 text-sm font-medium text-slate-700">Aperçu de l’image</p>
                                <img
                                    src={formData.image_medecin}
                                    alt="Preview du médecin"
                                    className="max-h-44 w-full rounded-3xl object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Enregistrement...' : actionLabel}
                        </button>
                        {(!initialMedecin || onCancel) && (
                            <button
                                type="button"
                                onClick={onCancel ? onCancel : () => navigate('/admin/medecins')}
                                className="inline-flex justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Retour
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
