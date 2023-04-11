export interface Root {
    name: string
    Telephone: string
    SocialMedia: Medum[]
    HistoricalWork: HistoricalWork[]
    education: Education[]
    Certificate: Certificate[]
    Skills: Skill[]
}

export interface Medum {
    name: string
    url: string
}

export interface HistoricalWork {
    company: string
    start: string
    Saida: string
    Tecnical: string
    Manager: string
    Tecnical_short: string
    Manager_short: string
}

export interface Education {
    school: string
    degree: string
    start: string
    end: string
}

export interface Certificate {
    name: string
    institute: string
    Credential: string
    Issued: string
}

export interface Skill {
    name: string
    value: number
}
