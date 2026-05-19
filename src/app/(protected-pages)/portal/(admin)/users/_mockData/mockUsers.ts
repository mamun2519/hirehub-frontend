export interface MockRecruiter {
    id: string
    name: string // Company name
    website: string
    email: string
    location: string
    status: 'Active' | 'Suspended'
    createdAt: string
}

export interface MockCandidate {
    id: string
    name: string
    email: string
    role: string
    phone: string
    status: 'Active' | 'Suspended' | 'Pending'
    createdAt: string
}

export const mockRecruiters: MockRecruiter[] = [
    {
        id: 'REC-001',
        name: 'TechVibe Solutions',
        website: 'https://techvibe.io',
        email: 'careers@techvibe.io',
        location: 'San Francisco, CA',
        status: 'Active',
        createdAt: '2026-01-15',
    },
    {
        id: 'REC-002',
        name: 'Innova Softworks',
        website: 'https://innovasoft.com',
        email: 'hr@innovasoft.com',
        location: 'Austin, TX',
        status: 'Active',
        createdAt: '2026-02-10',
    },
    {
        id: 'REC-003',
        name: 'Apex Recruiting Group',
        website: 'https://apexrecruit.com',
        email: 'info@apexrecruit.com',
        location: 'New York, NY',
        status: 'Suspended',
        createdAt: '2025-11-05',
    },
    {
        id: 'REC-004',
        name: 'ByteCraft Technologies',
        website: 'https://bytecraft.dev',
        email: 'jobs@bytecraft.dev',
        location: 'Seattle, WA',
        status: 'Active',
        createdAt: '2026-03-22',
    },
    {
        id: 'REC-005',
        name: 'GreenField Ventures',
        website: 'https://greenfield.vc',
        email: 'talent@greenfield.vc',
        location: 'Boston, MA',
        status: 'Active',
        createdAt: '2026-04-01',
    },
]

export const mockCandidates: MockCandidate[] = [
    {
        id: 'CAN-001',
        name: 'Sarah Connor',
        email: 'sarah.connor@gmail.com',
        role: 'Senior React Developer',
        phone: '+1 (555) 019-2834',
        status: 'Active',
        createdAt: '2026-02-18',
    },
    {
        id: 'CAN-002',
        name: 'John Doe',
        email: 'john.doe@yahoo.com',
        role: 'Full Stack Engineer',
        phone: '+1 (555) 014-9988',
        status: 'Pending',
        createdAt: '2026-03-05',
    },
    {
        id: 'CAN-003',
        name: 'Alex Mercer',
        email: 'alex.m@outlook.com',
        role: 'DevOps Engineer',
        phone: '+1 (555) 017-4321',
        status: 'Active',
        createdAt: '2026-01-28',
    },
    {
        id: 'CAN-004',
        name: 'Elena Rostova',
        email: 'elena.rostova@meta.com',
        role: 'Product Designer',
        phone: '+1 (555) 012-7766',
        status: 'Suspended',
        createdAt: '2025-12-12',
    },
    {
        id: 'CAN-005',
        name: 'Marcus Vance',
        email: 'marcus.v@gmail.com',
        role: 'Data Scientist',
        phone: '+1 (555) 016-8899',
        status: 'Active',
        createdAt: '2026-04-10',
    },
]
