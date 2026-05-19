import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createSpecialiteService, getSpecialiteService, updateSpecialiteService } from '../services/admin.service'

export default function SpecialiteForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({ name: '', description: '' })

    useEffect(() => {
        if (!id) return
        const fetchOne = async () => {
            setLoading(true)
            try {
                const res = await getSpecialiteService(id)
                const data = res?.data ?? res
                setForm({
                    name: data.name || '',
                    description: data.description || ''
                })
            } catch (err) {
                setError('Impossible de charger la spécialité.')
            } finally {
                setLoading(false)
            }
        }
        fetchOne()
    }, [id])

    const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (id) {
                await updateSpecialiteService(id, form)
            } else {
                await createSpecialiteService(form)
            }
            navigate('/admin/specialites')
        } catch (err) {
            setError('Impossible d’enregistrer la spécialité.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{id ? 'Éditer spécialité' : 'Nouvelle spécialité'}</h1>
                        <p className="mt-2 text-sm text-slate-500">{id ? 'Modifiez la spécialité.' : 'Créez une nouvelle spécialité.'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                    {error && <p className="text-sm text-rose-600">{error}</p>}

                    <div>
                        <label className="text-sm text-slate-600">Nom</label>
                        <input
                            value={form.name}
                            onChange={handleChange('name')}
                            required
                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">Description</label>
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none h-28"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={loading} className="inline-flex items-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700">
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/specialites')} className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
