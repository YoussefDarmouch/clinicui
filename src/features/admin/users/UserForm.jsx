import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    createUserService,
    getUserService,
    updateUserService,
} from '../services/admin.service'

const ROLE_OPTIONS = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'medecin' },
    { id: 3, name: 'patient' },
]

export default function UserForm({ user: initialUser, onSuccess, onCancel }) {
    const params = useParams()
    const navigate = useNavigate()
    const isNew = params?.id === undefined && !initialUser
    const [user, setUser] = useState(initialUser)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        is_active: true,
        password: '',
        password_confirmation: '',
        roles: [],
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(Boolean(params?.id))
    const [serverError, setServerError] = useState('')

    const title = initialUser ? 'Modifier l’utilisateur' : 'Créer un nouvel utilisateur'
    const actionLabel = initialUser ? 'Mettre à jour' : 'Créer'

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser)
            setFormData((current) => ({
                ...current,
                name: initialUser.name ?? '',
                email: initialUser.email ?? '',
                phone: initialUser.phone ?? '',
                address: initialUser.address ?? '',
                is_active: initialUser.is_active ?? true,
                roles: initialUser.roles?.map((role) => role.id) ?? [],
            }))
            setLoading(false)
        } else if (params?.id) {
            const fetchUser = async () => {
                setLoading(true)
                try {
                    const response = await getUserService(params.id)
                    const fetched = response?.data ?? response
                    setUser(fetched)
                    setFormData((current) => ({
                        ...current,
                        name: fetched.name ?? '',
                        email: fetched.email ?? '',
                        phone: fetched.phone ?? '',
                        address: fetched.address ?? '',
                        is_active: fetched.is_active ?? true,
                        roles: fetched.roles?.map((role) => role.id) ?? [],
                    }))
                } catch (err) {
                    setServerError('Impossible de charger le profil utilisateur.')
                } finally {
                    setLoading(false)
                }
            }
            fetchUser()
        }
    }, [initialUser, params?.id])

    const getFieldError = (field) => {
        if (!errors) return undefined
        if (errors[field]) return errors[field][0]
        const wildcardKey = Object.keys(errors).find((key) => key.startsWith(`${field}.`))
        return wildcardKey ? errors[wildcardKey][0] : undefined
    }

    const availableRoles = useMemo(
        () => ROLE_OPTIONS.map((option) => ({
            ...option,
            label: option.name === 'admin' ? 'Administrateur' : option.name === 'medecin' ? 'Médecin' : 'Patient',
        })),
        []
    )

    const handleChange = (field) => (event) => {
        setFormData((current) => ({ ...current, [field]: event.target.value }))
    }

    const handleRoleToggle = (roleId) => {
        setFormData((current) => {
            const hasRole = current.roles.includes(roleId)
            return {
                ...current,
                roles: hasRole ? current.roles.filter((item) => item !== roleId) : [...current.roles, roleId],
            }
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setErrors({})
        setServerError('')

        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            roles: formData.roles,
        }

        payload.is_active = Boolean(formData.is_active)

        if (!initialUser) {
            payload.password = formData.password
            payload.password_confirmation = formData.password_confirmation
        } else if (formData.password) {
            payload.password = formData.password
            payload.password_confirmation = formData.password_confirmation
        }

        try {
            const response = initialUser
                ? await updateUserService(initialUser.id, payload)
                : await createUserService(payload)
            const result = response?.data ?? response

            if (onSuccess) {
                onSuccess(result)
            } else {
                navigate('/admin/users')
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
                <p className="text-sm text-slate-500">Chargement du formulaire utilisateur...</p>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500">Remplissez les informations de l’utilisateur puis enregistrez.</p>
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
                        <span className="text-sm font-medium text-slate-700">Nom</span>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleChange('name')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                        />
                        {errors.name && <p className="text-xs text-rose-600">{errors.name[0]}</p>}
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                        />
                        {errors.email && <p className="text-xs text-rose-600">{errors.email[0]}</p>}
                    </label>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Téléphone</span>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                        />
                            {getFieldError('phone') && <p className="text-xs text-rose-600">{getFieldError('phone')}</p>}
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Adresse</span>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={handleChange('address')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('address') && <p className="text-xs text-rose-600">{getFieldError('address')}</p>}
                        </label>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={Boolean(formData.is_active)}
                                onChange={(event) => setFormData((current) => ({ ...current, is_active: event.target.checked }))}
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                            Actif
                        </label>
                        <p className="text-sm text-slate-500">Laisser décoché pour désactiver le compte.</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Mot de passe {initialUser ? '(laisser vide pour conserver)' : ''}</span>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={handleChange('password')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('password') && <p className="text-xs text-rose-600">{getFieldError('password')}</p>}
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Confirmer le mot de passe</span>
                            <input
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange('password_confirmation')}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            {getFieldError('password_confirmation') && <p className="text-xs text-rose-600">{getFieldError('password_confirmation')}</p>}
                        </label>
                    </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-700">Rôles</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {availableRoles.map((role) => (
                            <label key={role.id} className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300">
                                <input
                                    type="checkbox"
                                    checked={formData.roles.includes(role.id)}
                                    onChange={() => handleRoleToggle(role.id)}
                                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                {role.label}
                            </label>
                        ))}
                    </div>
                    {getFieldError('roles') && <p className="mt-2 text-xs text-rose-600">{getFieldError('roles')}</p>}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? 'Enregistrement...' : actionLabel}
                    </button>
                    {!initialUser && (
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="inline-flex justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Retour
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
