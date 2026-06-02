// ─── Company Details ───────────────────────────────────────────────────────────

export const COMPANY = {
  name: 'Nobilitas Ventures LLP',
  gst: '08AANFN2099R1Z8',
  email: 'mail@nobilitas.in',
  phone: '+91 93140 93160',
  whatsapp: '919314093160',
  addressLine1: 'C 3 & 4, Above Evok Furniture Store',
  addressLine2: 'MJRP College Road, Nandpuri',
  city: 'Jaipur 302019',
  state: 'Rajasthan, India',
  fullAddress: 'C 3 & 4, Above Evok Furniture Store, MJRP College Road, Nandpuri, Jaipur 302019, Rajasthan',
  estd: '2014',
} as const

// ─── Clients ─────────────────────────────────────────────────────────────────
// Used on: homepage partners marquee, about page clients grid

export interface Client {
  name: string
  shortName: string  // Used in marquee (shorter version)
}

export const CLIENTS: Client[] = [
  { name: 'Taj Hotels', shortName: 'TAJ HOTELS' },
  { name: 'Infosys Ltd', shortName: 'INFOSYS' },
  { name: 'AIIMS', shortName: 'AIIMS' },
  { name: 'Reliance', shortName: 'RELIANCE' },
  { name: 'Oberoi Group', shortName: 'OBEROI' },
  { name: 'Tata Steel', shortName: 'TATA STEEL' },
  { name: 'ITC Limited', shortName: 'ITC LIMITED' },
  { name: 'Jaipur Rugs', shortName: 'JAIPUR RUGS' },
  { name: 'JK Cement', shortName: 'JK CEMENT' },
  { name: 'Marriott', shortName: 'MARRIOTT' },
  { name: 'Wipro', shortName: 'WIPRO' },
  { name: 'Hindustan Zinc', shortName: 'HINDUSTAN ZINC' },
]

// ─── Brands ──────────────────────────────────────────────────────────────────
// Used on: about page brands section

export interface Brand {
  name: string
  category: string
}

export const BRANDS: Brand[] = [
  { name: 'Diversey', category: 'Cleaning' },
  { name: '3M', category: 'Cleaning & Safety' },
  { name: 'Godrej Interio', category: 'Furniture' },
  { name: 'Kimberly-Clark', category: 'Hygiene' },
  { name: 'Philips', category: 'Lighting & Electronics' },
  { name: 'Tata Consumer', category: 'Pantry' },
  { name: 'Sleepwell', category: 'Mattresses' },
  { name: 'Kurl-on', category: 'Mattresses' },
  { name: 'Polycab', category: 'Cables & Wiring' },
  { name: 'JK Paper', category: 'Paper & Stationery' },
  { name: 'Roots Multiclean', category: 'Housekeeping' },
  { name: 'ITC Paperboards', category: 'Packaging' },
]
