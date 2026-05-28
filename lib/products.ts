export type ProductTone = 'warm' | 'deep' | 'default' | 'sage' | 'cocoa';

export type ProductCategory =
  | 'Furniture' | 'Cleaning' | 'Electronics' | 'Lighting'
  | 'Safety' | 'Packaging' | 'Pantry' | 'Gifting'
  | 'Mattress' | 'Buggies' | 'Cables' | 'Audio' | 'Paper';

export interface Product {
  id: string;
  cat: ProductCategory;
  icon: keyof typeof ICON_PATHS;
  name: string;
  meta: string;
  badge: string | null;
  solid: boolean;
  tone: ProductTone;
  sku: string;
  // Extended fields for detail page
  brand: string;
  description: string;
  specs: { label: string; value: string }[];
  certifications: string[];
  moq: string;
  leadTime: string;
  delivery: string;
  relatedIds: string[];
}

export const ICON_PATHS = {
  sparkles: 'M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z',
  armchair: 'M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3H5v-3zM5 14v6M19 14v6M7 9V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4',
  monitor: 'M2 3h20a0 0 0 0 1 0 0v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zM8 21h8M12 17v4',
  lamp: 'M7 2l4 8h2l4-8H7zM10 10v10h4V10M8 20h8',
  hardhat: 'M2 18a5 5 0 0 1 10 0M10 14a8 8 0 0 1 8-8 8 8 0 0 1 4 1M2 18h20',
  package: 'M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zm-10-11.76 8.73 5.05M12 22.08V12',
  coffee: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  bed: 'M2 18v-7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7M2 14h20M2 18h20M8 11h4',
  carfront: 'M6 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 14h20l-2-7H4z',
  cable: 'M4 9V6a2 2 0 0 1 2-2h2v6H4zM16 4h2a2 2 0 0 1 2 2v3h-4zM8 10v4a4 4 0 0 0 8 0V10',
  speaker: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 7h.01',
  filetext: 'M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M16 2l6 6M16 8H8M16 12H8M14 16H8'
} as const;

export const PRODUCTS: Product[] = [
  {
    id: 'f01', cat: 'Furniture', icon: 'armchair',
    name: 'executive conference table — walnut',
    meta: '8 sizes · Godrej Interio', badge: 'Bestseller', solid: true, tone: 'warm', sku: 'OF-CT-W24',
    brand: 'Godrej Interio',
    description: 'A solid-core conference table in natural walnut veneer. Available in 8 seating configurations from 6-person to 18-person. Custom dimensions on inquiry.',
    specs: [{ label: 'Material', value: 'Walnut veneer over engineered hardwood core' }, { label: 'Sizes', value: '6-seater to 18-seater — 8 standard configurations' }, { label: 'Finish options', value: 'Natural walnut, dark walnut, matte white' }, { label: 'Weight', value: '60kg to 180kg depending on size' }, { label: 'Warranty', value: '3 years manufacturer warranty' }, { label: 'Origin', value: 'Made in India' }],
    certifications: ['Godrej Interio', 'Made in India', 'BIS registered'],
    moq: '1 unit', leadTime: '10–14 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['f02', 'f03'],
  },
  {
    id: 'f02', cat: 'Furniture', icon: 'armchair',
    name: 'ergonomic task chair — mesh back',
    meta: '5 colorways · BIFMA tested', badge: null, solid: false, tone: 'deep', sku: 'OF-TC-MB1',
    brand: 'Godrej Interio',
    description: 'Ergonomic mesh-back task chair with lumbar support, adjustable armrests, and tilt mechanism. BIFMA tested for 8-hour daily use.',
    specs: [{ label: 'Back material', value: 'High-tensile mesh — 5 colorways' }, { label: 'Seat material', value: 'High-density foam, fabric upholstered' }, { label: 'Adjustments', value: 'Height, armrests, lumbar, tilt tension' }, { label: 'Weight capacity', value: '120kg' }, { label: 'Warranty', value: '2 years' }, { label: 'Certification', value: 'BIFMA X5.1 tested' }],
    certifications: ['BIFMA tested', 'Made in India'],
    moq: '1 unit (bulk pricing 10+)', leadTime: '7–10 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['f01', 'f03'],
  },
  {
    id: 'f03', cat: 'Furniture', icon: 'armchair',
    name: 'modular workstation — 6-person cluster',
    meta: 'Custom dimensions', badge: null, solid: false, tone: 'default', sku: 'OF-WS-06',
    brand: 'Godrej Interio',
    description: 'Six-person open-plan workstation cluster with cable management, privacy screens, and overhead storage. Fully modular — add or remove pods as headcount changes.',
    specs: [{ label: 'Configuration', value: '6-person cluster (2×3 pods)' }, { label: 'Material', value: 'Steel frame, laminate worktop' }, { label: 'Cable management', value: 'Integrated cable trays and floor box' }, { label: 'Storage', value: 'Overhead bins and mobile pedestals' }, { label: 'Lead time', value: '14–21 working days (custom)' }, { label: 'Origin', value: 'Made in India' }],
    certifications: ['Godrej Interio', 'BIS registered'],
    moq: '1 cluster', leadTime: '14–21 working days', delivery: 'Pan-India, installation available',
    relatedIds: ['f01', 'f02'],
  },
  {
    id: 'c01', cat: 'Cleaning', icon: 'sparkles',
    name: 'industrial floor scrubber — 60L',
    meta: 'ISI · 3 capacities', badge: 'In stock', solid: false, tone: 'sage', sku: 'CL-FS-60',
    brand: 'Diversey',
    description: 'Walk-behind industrial floor scrubber with 60-litre solution tank. ISI certified. Ideal for warehouses, hospitals, and large office floors. Also available in 40L and 80L.',
    specs: [{ label: 'Tank capacity', value: '60L solution, 60L recovery' }, { label: 'Cleaning path', value: '530mm' }, { label: 'Runtime', value: '3 hours per charge' }, { label: 'Certification', value: 'ISI (IS 302-2-29)' }, { label: 'Variants', value: '40L, 60L, 80L' }, { label: 'Warranty', value: '1 year on machine, 6 months on batteries' }],
    certifications: ['ISI certified', 'IS 302-2-29'],
    moq: '1 unit', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['c02', 'c03'],
  },
  {
    id: 'c02', cat: 'Cleaning', icon: 'sparkles',
    name: 'diversey suma D1.1 — degreaser',
    meta: '5L · 25L · 200L drums', badge: null, solid: false, tone: 'default', sku: 'CL-DG-D1',
    brand: 'Diversey',
    description: 'Industrial-grade alkaline degreaser for kitchens, pantries, and heavy-use surfaces. Biodegradable formula. Available in 5L, 25L, and 200L bulk drums.',
    specs: [{ label: 'Brand', value: 'Diversey — Suma D1.1' }, { label: 'Type', value: 'Alkaline degreaser' }, { label: 'Sizes', value: '5L, 25L, 200L drum' }, { label: 'Dilution ratio', value: '1:10 to 1:50 depending on soiling' }, { label: 'Compliance', value: 'REACH compliant, biodegradable' }, { label: 'pH', value: '13.0 (concentrate)' }],
    certifications: ['REACH compliant', 'Biodegradable formula'],
    moq: '4 units (5L) or 1 drum (25L/200L)', leadTime: '3–5 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['c01', 'c03'],
  },
  {
    id: 'c03', cat: 'Cleaning', icon: 'sparkles',
    name: 'housekeeping cart — twin-bin',
    meta: 'Stainless · galvanised', badge: null, solid: false, tone: 'deep', sku: 'CL-HK-TB',
    brand: 'Roots Multiclean',
    description: 'Heavy-duty twin-bin housekeeping cart for hotels and hospitals. Stainless steel or galvanised finish. Fits standard 120L and 240L bin liners.',
    specs: [{ label: 'Material', value: 'Stainless steel (304 grade) or galvanised steel' }, { label: 'Bin capacity', value: '2 × 80L compartments' }, { label: 'Casters', value: '200mm non-marking swivel casters' }, { label: 'Dimensions', value: '1100 × 600 × 950mm (L×W×H)' }, { label: 'Weight', value: '22kg (stainless), 18kg (galvanised)' }, { label: 'Warranty', value: '1 year against manufacturing defects' }],
    certifications: ['IS 1570 (stainless grade)'],
    moq: '1 unit', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['c01', 'c02'],
  },
  {
    id: 'e01', cat: 'Electronics', icon: 'monitor',
    name: '27" 4K monitor — IPS panel',
    meta: 'Dell · HP · LG variants', badge: null, solid: false, tone: 'cocoa', sku: 'EL-MN-27',
    brand: 'Dell / HP / LG',
    description: '27-inch 4K IPS monitors for corporate workstations. Available in Dell U2723D, HP Z27k G3, and LG 27UK850 variants. Bulk pricing available for 10+ units.',
    specs: [{ label: 'Screen size', value: '27 inches' }, { label: 'Resolution', value: '3840 × 2160 (4K UHD)' }, { label: 'Panel type', value: 'IPS — 99% sRGB' }, { label: 'Refresh rate', value: '60Hz' }, { label: 'Connectivity', value: 'USB-C, HDMI, DisplayPort' }, { label: 'Warranty', value: '3 years on-site (Dell/HP)' }],
    certifications: ['BIS registered', 'Energy Star', 'RoHS'],
    moq: '1 unit (bulk pricing 10+)', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['e02'],
  },
  {
    id: 'e02', cat: 'Electronics', icon: 'monitor',
    name: 'multifunction printer A3 — laser',
    meta: 'Canon · Xerox', badge: null, solid: false, tone: 'default', sku: 'EL-PR-A3',
    brand: 'Canon / Xerox',
    description: 'A3 laser multifunction printer — print, scan, copy, fax. Available in Canon ImageRunner and Xerox AltaLink variants. Ideal for offices with high monthly print volumes.',
    specs: [{ label: 'Print speed', value: 'Up to 30ppm (A4), 20ppm (A3)' }, { label: 'Resolution', value: '1200 × 1200 dpi' }, { label: 'Paper capacity', value: '2 × 500-sheet trays (standard)' }, { label: 'Connectivity', value: 'Ethernet, Wi-Fi, USB, cloud print' }, { label: 'Monthly duty cycle', value: 'Up to 80,000 pages' }, { label: 'Warranty', value: '1 year on-site' }],
    certifications: ['BIS registered', 'Energy Star', 'RoHS'],
    moq: '1 unit', leadTime: '7–10 working days', delivery: 'Pan-India, installation available',
    relatedIds: ['e01'],
  },
  {
    id: 'l01', cat: 'Lighting', icon: 'lamp',
    name: 'architectural pendant — antique brass',
    meta: '12 finishes · custom', badge: null, solid: false, tone: 'cocoa', sku: 'LT-PD-AB',
    brand: 'Philips / Custom',
    description: 'Architectural pendant luminaire in antique brass finish. Available in 12 standard finishes and fully custom. Suitable for hotel lobbies, restaurants, and premium offices.',
    specs: [{ label: 'Wattage', value: '12W LED (non-replaceable)' }, { label: 'Colour temperature', value: '2700K / 3000K / 4000K' }, { label: 'CRI', value: '>90' }, { label: 'Finishes', value: '12 standard + custom on inquiry' }, { label: 'IP rating', value: 'IP20 (indoor)' }, { label: 'Warranty', value: '2 years' }],
    certifications: ['BIS registered', 'IS 10322'],
    moq: '1 unit (custom orders MOQ 6)', leadTime: '10–14 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['l02'],
  },
  {
    id: 'l02', cat: 'Lighting', icon: 'lamp',
    name: 'LED panel — 600×600 recessed',
    meta: '30W · 40W · 50W', badge: 'New 2026', solid: true, tone: 'warm', sku: 'LT-LP-66',
    brand: 'Philips',
    description: 'Slim recessed LED panel for suspended ceilings. 600×600mm format. Available in 30W, 40W, and 50W. Uniform illumination, flicker-free, suitable for offices and hospitals.',
    specs: [{ label: 'Size', value: '600 × 600mm' }, { label: 'Wattage', value: '30W / 40W / 50W' }, { label: 'Colour temperature', value: '3000K / 4000K / 6500K' }, { label: 'Lumens', value: '3000lm (30W) to 5000lm (50W)' }, { label: 'IP rating', value: 'IP40' }, { label: 'Warranty', value: '3 years' }],
    certifications: ['BIS registered', 'IS 10322', 'Energy Star'],
    moq: '10 units', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['l01'],
  },
  {
    id: 's01', cat: 'Safety', icon: 'hardhat',
    name: 'safety helmet — ISI type-A',
    meta: 'Bulk pricing 100+', badge: null, solid: false, tone: 'default', sku: 'SF-HM-TA',
    brand: 'Karam / 3M',
    description: 'ISI-marked Type-A safety helmet for construction and industrial use. Available in 6 colours. Bulk pricing available for orders of 100+ units with custom branding.',
    specs: [{ label: 'Type', value: 'Type-A (full brim)' }, { label: 'Certification', value: 'ISI (IS 2925)' }, { label: 'Material', value: 'HDPE shell, nylon suspension' }, { label: 'Colors', value: '6 standard colors' }, { label: 'Custom branding', value: 'Available on orders 100+' }, { label: 'Weight', value: '~380g' }],
    certifications: ['ISI marked', 'IS 2925'],
    moq: '12 units', leadTime: '3–5 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['s02'],
  },
  {
    id: 's02', cat: 'Safety', icon: 'hardhat',
    name: 'high-visibility vest — class 2',
    meta: '5 sizes · custom branding', badge: null, solid: false, tone: 'warm', sku: 'SF-VS-C2',
    brand: 'Kimberly-Clark',
    description: 'Class 2 high-visibility safety vest in fluorescent yellow or orange. 5 sizes. Custom logo printing available for corporate and construction clients.',
    specs: [{ label: 'Class', value: 'Class 2 (EN ISO 20471)' }, { label: 'Material', value: '100% polyester mesh' }, { label: 'Colors', value: 'Fluorescent yellow, fluorescent orange' }, { label: 'Sizes', value: 'XS to XXL' }, { label: 'Custom branding', value: 'Reflective logo print on front and back' }, { label: 'Washing', value: 'Machine washable up to 40°C' }],
    certifications: ['EN ISO 20471 Class 2'],
    moq: '24 units', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['s01'],
  },
  {
    id: 'p01', cat: 'Packaging', icon: 'package',
    name: 'corrugated boxes — 3-ply, 5-ply',
    meta: 'Custom sizes · MOQ 500', badge: null, solid: false, tone: 'deep', sku: 'PK-CB-35',
    brand: 'ITC / Custom',
    description: 'Custom-printed corrugated shipping boxes in 3-ply and 5-ply. Any size on inquiry. Minimum order 500 units. Lead time 7–10 days for custom print runs.',
    specs: [{ label: 'Ply options', value: '3-ply (standard) · 5-ply (heavy duty)' }, { label: 'Sizes', value: 'Any dimension — custom on inquiry' }, { label: 'Printing', value: 'Up to 4-color flexo print' }, { label: 'Bursting strength', value: '10 kgf/cm² (3-ply) · 18 kgf/cm² (5-ply)' }, { label: 'MOQ', value: '500 units per size/print' }, { label: 'Origin', value: 'Made in India' }],
    certifications: ['IS 2771 (corrugated boxes)'],
    moq: '500 units', leadTime: '7–10 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: [],
  },
  {
    id: 'n01', cat: 'Pantry', icon: 'coffee',
    name: 'commercial espresso machine — 2-group',
    meta: 'La Marzocco · Faema', badge: null, solid: false, tone: 'cocoa', sku: 'PN-ES-2G',
    brand: 'La Marzocco / Faema',
    description: 'Two-group commercial espresso machine for corporate cafeterias and hotel lobbies. Available in La Marzocco Linea and Faema E98 variants. Full installation and barista training available.',
    specs: [{ label: 'Groups', value: '2 (high-volume variants available)' }, { label: 'Boiler', value: 'Dual boiler — independent temperature control' }, { label: 'Power', value: '3.5kW / 230V' }, { label: 'Water connection', value: 'Direct plumb or reservoir' }, { label: 'Dimensions', value: '820 × 550 × 530mm' }, { label: 'Warranty', value: '1 year parts + labour' }],
    certifications: ['CE certified', 'BIS registered'],
    moq: '1 unit', leadTime: '10–14 working days', delivery: 'Pan-India, installation available',
    relatedIds: ['n02'],
  },
  {
    id: 'n02', cat: 'Pantry', icon: 'coffee',
    name: 'pantry refill — tea, coffee, sugar',
    meta: 'Monthly subscription', badge: 'Subscription', solid: true, tone: 'default', sku: 'PN-RF-MO',
    brand: 'Tata Consumer / Multiple',
    description: 'Monthly pantry refill subscription — tea, coffee, sugar, and condiments. Customise quantities to your headcount. Delivered to your office door on a fixed schedule.',
    specs: [{ label: 'Includes', value: 'Tea bags, instant coffee, sugar sachets, condiments' }, { label: 'Brands', value: 'Tata Tea, Nescafé, or client-specified' }, { label: 'Headcount sizing', value: 'Packs for 10 to 500 employees' }, { label: 'Delivery frequency', value: 'Monthly (fortnightly available)' }, { label: 'Contract', value: 'Month-to-month or annual (discounted)' }, { label: 'Customisation', value: 'Full SKU list adjustable per delivery' }],
    certifications: ['FSSAI licensed suppliers'],
    moq: '1 month subscription', leadTime: '3–5 days (first delivery)', delivery: 'Pan-India scheduled delivery',
    relatedIds: ['n01'],
  },
  {
    id: 'g01', cat: 'Gifting', icon: 'gift',
    name: 'diwali hamper — mehfil edition',
    meta: 'Custom 24-piece sets', badge: 'Seasonal', solid: true, tone: 'warm', sku: 'CG-MH-24',
    brand: 'Nobilitas Curated',
    description: 'A 24-piece curated Diwali hamper in a handcrafted wooden box. Includes premium dry fruits, artisanal sweets, and branded merchandise. Custom branding on box and items.',
    specs: [{ label: 'Contents', value: '24 curated pieces — dry fruits, sweets, merchandise' }, { label: 'Packaging', value: 'Handcrafted wooden box with custom print' }, { label: 'Branding', value: 'Full custom — box, items, ribbon, card' }, { label: 'MOQ', value: '25 hampers' }, { label: 'Lead time', value: '14–21 days (order early)' }, { label: 'Delivery', value: 'Pan-India — individual recipient addresses available' }],
    certifications: ['FSSAI licensed', 'Handcrafted in Rajasthan'],
    moq: '25 hampers', leadTime: '14–21 working days', delivery: 'Pan-India, individual addresses',
    relatedIds: ['g02'],
  },
  {
    id: 'g02', cat: 'Gifting', icon: 'gift',
    name: 'onboarding kit — welcome box',
    meta: 'Branded · 4-piece', badge: null, solid: false, tone: 'sage', sku: 'CG-OB-04',
    brand: 'Nobilitas Curated',
    description: 'A 4-piece branded employee onboarding kit in a rigid box. Includes a notebook, pen, water bottle, and welcome card — all custom printed with your brand.',
    specs: [{ label: 'Contents', value: 'Notebook (A5), pen, water bottle (350ml), welcome card' }, { label: 'Branding', value: 'All items custom printed — pantone matching available' }, { label: 'Box', value: 'Rigid lid-and-base box with tissue paper' }, { label: 'MOQ', value: '50 kits' }, { label: 'Lead time', value: '10–14 working days' }, { label: 'Add-ons', value: 'Lanyard, badge holder, tote bag — on inquiry' }],
    certifications: ['Made in India'],
    moq: '50 kits', leadTime: '10–14 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['g01'],
  },
  {
    id: 'm01', cat: 'Mattress', icon: 'bed',
    name: 'hotel mattress — king 6-zone',
    meta: 'Sleepwell · Kurl-on', badge: null, solid: false, tone: 'default', sku: 'MT-HK-6Z',
    brand: 'Sleepwell / Kurl-on',
    description: '6-zone pocket spring hotel mattress in King size. Available in Sleepwell Neem Fresche and Kurl-on Spine Tutor variants. Bulk pricing for hotels ordering 20+ units.',
    specs: [{ label: 'Size', value: 'King (180 × 200cm) — other sizes on inquiry' }, { label: 'Type', value: '6-zone pocket spring with memory foam top' }, { label: 'Height', value: '25cm' }, { label: 'Cover', value: 'Quilted euro-top — removable and washable' }, { label: 'Warranty', value: '7 years' }, { label: 'Bulk pricing', value: 'Available for 20+ units' }],
    certifications: ['IS 13871 (spring mattresses)', 'CertiPUR foam'],
    moq: '1 unit (bulk pricing 20+)', leadTime: '7–10 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: [],
  },
  {
    id: 'b01', cat: 'Buggies', icon: 'carfront',
    name: 'electric buggy — 6-seater',
    meta: 'Lithium · 80km range', badge: null, solid: false, tone: 'sage', sku: 'BG-EL-06',
    brand: 'Mahindra Electric / YS Electric',
    description: 'Six-seater electric buggy for hotels, airports, campuses, and industrial facilities. 80km range per charge. Available with canopy or open-top. Custom livery available.',
    specs: [{ label: 'Seating', value: '6 passengers + driver' }, { label: 'Battery', value: '48V Lithium-ion — 80km range' }, { label: 'Max speed', value: '25 km/h' }, { label: 'Charging time', value: '8 hours (standard) · 4 hours (fast)' }, { label: 'Payload', value: '500kg' }, { label: 'Warranty', value: '2 years (vehicle) · 1 year (battery)' }],
    certifications: ['CMVR compliant', 'BIS registered'],
    moq: '1 unit', leadTime: '21–30 working days', delivery: 'Pan-India, delivery charges apply',
    relatedIds: [],
  },
  {
    id: 'w01', cat: 'Cables', icon: 'cable',
    name: 'cat 6A LAN cable — 305m roll',
    meta: 'Shielded · plenum', badge: null, solid: false, tone: 'deep', sku: 'WR-LN-6A',
    brand: 'Polycab / D-Link',
    description: 'Category 6A shielded LAN cable on a 305-metre pull-box. Plenum-rated jacket for in-wall and ceiling runs. Supports 10Gbps at 500MHz. Polycab or D-Link variants.',
    specs: [{ label: 'Category', value: 'Cat 6A (ISO/IEC 11801)' }, { label: 'Shielding', value: 'F/UTP (foil shielded)' }, { label: 'Jacket', value: 'Plenum-rated LSZH' }, { label: 'Speed', value: '10Gbps at 500MHz' }, { label: 'Roll length', value: '305 metres' }, { label: 'Warranty', value: '15 years system warranty (Polycab)' }],
    certifications: ['BIS registered', 'ISO/IEC 11801', 'LSZH rated'],
    moq: '1 roll', leadTime: '3–5 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['a01'],
  },
  {
    id: 'a01', cat: 'Audio', icon: 'speaker',
    name: 'conference speaker — dante',
    meta: 'Shure · Sennheiser', badge: null, solid: false, tone: 'cocoa', sku: 'AU-SP-DA',
    brand: 'Shure / Sennheiser',
    description: 'Professional Dante-networked conference room speaker with ceiling or table mount. Available in Shure MXA910 and Sennheiser TeamConnect variants. AV integrator support available.',
    specs: [{ label: 'Protocol', value: 'Dante AV-over-IP' }, { label: 'Microphones', value: 'Beamforming array — 8 channels' }, { label: 'Coverage', value: '360° pickup — up to 12-metre diameter' }, { label: 'Integration', value: 'Microsoft Teams, Zoom, Cisco Webex certified' }, { label: 'Mounting', value: 'Ceiling flush or surface mount' }, { label: 'Warranty', value: '2 years' }],
    certifications: ['CE certified', 'FCC certified', 'Zoom certified', 'Teams certified'],
    moq: '1 unit', leadTime: '10–14 working days', delivery: 'Pan-India, AV integration available',
    relatedIds: ['w01'],
  },
  {
    id: 'pa01', cat: 'Paper', icon: 'filetext',
    name: 'letterhead — 100 GSM bond',
    meta: 'Min 500 sheets', badge: null, solid: false, tone: 'warm', sku: 'PA-LH-BD',
    brand: 'ITC Paperboards / JK Paper',
    description: 'Custom-printed A4 letterhead on 100 GSM bond paper. Full-color offset printing. Minimum 500 sheets per order. Design service available on inquiry.',
    specs: [{ label: 'Paper', value: '100 GSM bond (ITC Paperboards / JK Paper)' }, { label: 'Size', value: 'A4 (210 × 297mm)' }, { label: 'Printing', value: 'Full-colour offset — CMYK + pantone' }, { label: 'Finish', value: 'Matte or gloss laminate available' }, { label: 'MOQ', value: '500 sheets per design' }, { label: 'Design', value: 'Design service available on inquiry' }],
    certifications: ['FSC certified paper'],
    moq: '500 sheets', leadTime: '5–7 working days', delivery: 'Pan-India from Jaipur',
    relatedIds: ['p01'],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(cat: ProductCategory): Product[] {
  return PRODUCTS.filter(p => p.cat === cat);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedIds
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 3);
}

export const CATEGORIES: ProductCategory[] = [
  'Furniture', 'Cleaning', 'Electronics', 'Lighting',
  'Safety', 'Packaging', 'Pantry', 'Gifting',
  'Mattress', 'Buggies', 'Cables', 'Audio', 'Paper',
];

export const CATEGORY_COUNTS: Record<string, number> = {
  All: PRODUCTS.length,
  ...Object.fromEntries(
    CATEGORIES.map(cat => [cat, PRODUCTS.filter(p => p.cat === cat).length])
  ),
};
