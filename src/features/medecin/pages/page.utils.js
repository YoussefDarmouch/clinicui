export const PAGE_SIZE = 10

export const normalizeNumber = (value) => {
    if (value === undefined || value === null) return 0
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
}

export const normalizeString = (value, fallback = '—') => {
    if (value === undefined || value === null) return fallback
    if (typeof value === 'string' && value.trim() === '') return fallback
    if (typeof value === 'object') {
        return (
            value.name ??
            value.full_name ??
            value.label ??
            value.user?.name ??
            value.patient_name ??
            value.medecin_name ??
            fallback
        )
    }
    return String(value)
}

export const toArray = (payload) => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload

    const data = payload.data ?? payload.items ?? payload.results ?? payload.list
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.data)) return data.data

    return []
}

export const toDate = (value) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value, withTime = false) => {
    const date = toDate(value)
    if (!date) return '—'
    return withTime
        ? date.toLocaleString('fr-FR')
        : date.toLocaleDateString('fr-FR')
}

export const isSameDay = (value, reference = new Date()) => {
    const date = toDate(value)
    if (!date) return false
    return (
        date.getFullYear() === reference.getFullYear() &&
        date.getMonth() === reference.getMonth() &&
        date.getDate() === reference.getDate()
    )
}

export const getStatusBadgeClass = (status) => {
    const value = String(status || '').toLowerCase()
    if (value.includes('annul') || value.includes('cancel')) {
        return 'bg-primary-100 text-primary-700'
    }
    if (value.includes('confirm') || value.includes('valid') || value.includes('termin') || value.includes('complete')) {
        return 'bg-primary-100 text-primary-700'
    }
    if (value.includes('attente') || value.includes('pending') || value.includes('planifi') || value.includes('plan')) {
        return 'bg-primary-100 text-primary-700'
    }
    return 'bg-slate-100 text-slate-700'
}

export const getInitials = (value) => {
    const label = normalizeString(value, '')
    if (!label) return 'NA'
    const parts = label.split(' ').filter(Boolean).slice(0, 2)
    if (parts.length === 0) return 'NA'
    return parts.map((part) => part[0]).join('').toUpperCase()
}

export const getDateFromItem = (item, keys) => {
    for (const key of keys) {
        if (item?.[key]) return item[key]
    }
    return null
}

export const buildMonthlySeries = (items, dateKeys, totalMonths = 6) => {
    const now = new Date()
    const months = []

    for (let i = totalMonths - 1; i >= 0; i -= 1) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`
        months.push({
            key,
            label: monthDate.toLocaleString('fr-FR', { month: 'short' }),
            value: 0,
        })
    }

    const map = new Map(months.map((entry) => [entry.key, entry]))

    items.forEach((item) => {
        const rawDate = getDateFromItem(item, dateKeys)
        const parsed = toDate(rawDate)
        if (!parsed) return

        const key = `${parsed.getFullYear()}-${parsed.getMonth()}`
        const row = map.get(key)
        if (row) row.value += 1
    })

    return months
}

export const countByStatus = (items, statusKey = 'statut') => {
    const result = {}
    items.forEach((item) => {
        const raw = item?.[statusKey] ?? item?.status ?? item?.etat ?? 'inconnu'
        const key = String(raw || 'inconnu').toLowerCase()
        result[key] = (result[key] ?? 0) + 1
    })
    return result
}

export const safeContains = (value, query) => {
    if (!value || !query) return false
    return String(value).toLowerCase().includes(query.toLowerCase())
}

export const extractOrdonnancesFromConsultations = (consultations) => {
    const rows = []

    consultations.forEach((consultation) => {
        const items =
            consultation?.ordonnances ??
            consultation?.prescriptions ??
            (consultation?.ordonnance ? [consultation.ordonnance] : [])

        if (!Array.isArray(items) || items.length === 0) return

        items.forEach((ordonnance, index) => {
            rows.push({
                id: ordonnance?.id ?? `${consultation?.id ?? 'consult'}-${index}`,
                consultationId: consultation?.id,
                patient: consultation?.patient_name ?? consultation?.patient?.name ?? consultation?.patient,
                medecin: consultation?.medecin_name ?? consultation?.medecin?.name ?? consultation?.medecin?.user?.name,
                diagnostic: consultation?.diagnostic,
                instructions: ordonnance?.instructions ?? ordonnance?.notes ?? ordonnance?.contenu,
                issuedAt: ordonnance?.issued_at ?? ordonnance?.created_at ?? consultation?.date_consultation,
                validUntil: ordonnance?.valid_until,
                statut: ordonnance?.statut ?? ordonnance?.status ?? 'active',
            })
        })
    })

    return rows
}
