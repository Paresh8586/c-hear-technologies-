export interface ProductVariant {
  label: string;
  options: string[];
}

export interface Product {
  sku: string;
  /** Manufacturer part number from the supplier feed */
  mpn?: string;
  category: string;
  brand: string;
  model: string;
  name: string;
  description: string;
  /** Cost price ex-VAT (from supplier feed). Sell price is derived by applyMargin(). */
  price: number | null;
  /** Weight in kg — used for delivery charge calculation */
  weight_kg?: number;
  stock_qty?: number;       // numeric stock count; undefined = untracked
  availability: string;
  warranty: string;
  published?: string;
  specs?: Record<string, string>;
  variants?: ProductVariant[];
}

/** Returns a stock status label and visual variant from stock_qty */
export function stockStatus(qty?: number): { label: string; level: 'in' | 'low' | 'out' | 'unknown' } {
  if (qty === undefined || qty === null) return { label: 'Quote / Confirm', level: 'unknown' };
  if (qty === 0) return { label: 'Out of Stock', level: 'out' };
  if (qty <= 5) return { label: `Low Stock (${qty})`, level: 'low' };
  return { label: 'In Stock', level: 'in' };
}

/** Human-readable label map for spec field keys, per category */
export const SPEC_LABELS: Record<string, Record<string, string>> = {
  'Laptops & Computers': {
    form_factor: 'Form Factor', display: 'Display', processor: 'Processor',
    memory: 'Memory (RAM)', storage: 'Storage', os: 'Operating System',
    connectivity: 'Wireless', ports: 'Ports',
  },
  'Monitors & Displays': {
    display_type: 'Panel Type', resolution: 'Resolution', panel: 'Surface',
    brightness: 'Brightness', ports: 'Ports', ergonomics: 'Ergonomics', aspect_ratio: 'Aspect Ratio',
  },
  'Printers & Imaging': {
    type: 'Type', function: 'Functions', speed: 'Print Speed',
    paper_format: 'Paper Format', connectivity: 'Connectivity',
    duplex: 'Duplex', duty_cycle: 'Monthly Duty Cycle', yield: 'Ink Yield',
  },
  'Networking': {
    type: 'Device Type', standard: 'Wi-Fi Standard', speed: 'Speed',
    mount: 'Mount', poe: 'PoE', antennas: 'Antennas', management: 'Management',
    ports: 'Ports', switching_capacity: 'Switching Capacity', power_budget: 'PoE Budget',
    throughput: 'Throughput', vpn: 'VPN Support', features: 'Features',
    wan: 'WAN', lan: 'LAN', standards: 'Standards', sim: 'SIM', wireless: 'Wireless',
    bands: 'Frequency Bands', fibre: 'Fibre Type', distance: 'Max Distance',
    interface: 'Interface', channels: 'Channels', video_out: 'Video Output',
  },
  'Servers & Data Centre': {
    type: 'Type', form_factor: 'Form Factor', processor: 'Processor',
    memory: 'Memory (RAM)', storage: 'Storage', network: 'Network', management: 'Remote Management',
  },
  'Storage': {
    type: 'Type', bays: 'Drive Bays', drives: 'Drives', network: 'Network',
    protocols: 'Protocols', os: 'OS / Firmware', rack_unit: 'Rack Unit',
    capacity: 'Capacity', interface: 'Interface', form_factor: 'Form Factor',
    endurance: 'Endurance', read_speed: 'Read Speed', media: 'Media', compatibility: 'Compatibility',
  },
  'Power & UPS': {
    type: 'Type', topology: 'Topology', form_factor: 'Form Factor',
    runtime: 'Runtime', outlets: 'Outlets', management: 'Management',
  },
  'Accessories': {
    type: 'Type', connection: 'Connection', range: 'Range', compatibility: 'Compatibility',
    battery: 'Battery', resolution: 'Resolution', fov: 'Field of View',
    autofocus: 'Autofocus', noise_cancellation: 'Noise Cancellation',
    microphone: 'Microphone', ports: 'Ports', power_delivery: 'Power Delivery',
    monitors: 'Monitors Supported', certifications: 'Certifications',
  },
  'CCTV & Security': {
    type: 'Type', resolution: 'Resolution', ir_range: 'IR Night Vision',
    compression: 'Compression', power: 'Power', weatherproofing: 'Weatherproofing',
    channels: 'Channels', storage: 'Storage', outputs: 'Video Output',
    camera_types: 'Camera Types', technology: 'Technology',
    connectivity: 'Connectivity', capacity: 'User Capacity', os: 'Software',
    integration: 'Integration', door_type: 'Door Type',
  },
  'Software & Licensing': {
    type: 'Type', platform: 'Platform', tier: 'Tier', includes: 'Includes',
    desktop_apps: 'Desktop Apps', licensing: 'Licensing Model',
    volume: 'Volume Licensing', channel: 'Channel', upgrade: 'Upgrade Path',
    licensing_model: 'Licensing Model', cal: 'CAL Type', editions: 'Editions',
    security: 'Security Level',
  },
  'Cybersecurity': {
    type: 'Type', platform: 'Platform', tier: 'Tier', includes: 'Includes',
    licensing: 'Licensing', management: 'Management Portal',
    vendors: 'Vendors', deployment: 'Deployment', throughput: 'Throughput',
    vpn: 'VPN', features: 'Features', form_factor: 'Form Factor',
  },
  'Meeting & Collaboration': {
    type: 'Type', fov: 'Field of View', resolution: 'Video Resolution',
    audio: 'Audio', room_size: 'Room Size', connection: 'Connection',
    certifications: 'Certifications', display: 'Display', integration: 'Integration',
    mounting: 'Mounting', platform: 'Platform', licensing: 'Licensing',
    devices: 'Compatible Devices', includes: 'Includes', management: 'Management',
  },
  'Cabling & Racks': {
    type: 'Type', standard: 'Standard', speed: 'Max Speed', frequency: 'Frequency',
    shielding: 'Shielding', jacket: 'Cable Jacket',
    size: 'Rack Size', mount: 'Mounting', depth: 'Depth',
    door: 'Door', colour: 'Colour', features: 'Features',
  },
  'Tablets & Mobile': {
    type: 'Type', display: 'Display', processor: 'Processor',
    memory: 'Memory (RAM)', storage: 'Storage', os: 'Operating System',
    connectivity: 'Connectivity', battery: 'Battery Life', sim: 'SIM / Cellular',
    features: 'Features',
  },
  'Projectors & AV': {
    type: 'Type', brightness: 'Brightness (Lumens)', resolution: 'Resolution',
    contrast: 'Contrast Ratio', throw_ratio: 'Throw Ratio', lamp_life: 'Lamp Life',
    connectivity: 'Connectivity', features: 'Features',
  },
  'Components & Upgrades': {
    type: 'Type', form_factor: 'Form Factor', capacity: 'Capacity',
    speed: 'Speed', interface: 'Interface', compatibility: 'Compatibility',
    features: 'Features',
  },
  'Telephony & VoIP': {
    type: 'Type', lines: 'Lines / Extensions', display: 'Display',
    handsets: 'Handsets', connectivity: 'Connectivity', protocol: 'Protocol',
    features: 'Features', platform: 'Platform', certifications: 'Certifications',
  },
  'Access Control': {
    type: 'Type', technology: 'Technology', capacity: 'User Capacity',
    connectivity: 'Connectivity', power: 'Power', weatherproofing: 'Weatherproofing',
    door_type: 'Door Type', integration: 'Integration', features: 'Features',
  },
  'Cloud Services': {
    type: 'Type', platform: 'Platform', tier: 'Tier', licensing: 'Licensing Model',
    storage: 'Cloud Storage', users: 'Users', region: 'Data Region',
    sla: 'SLA / Uptime', features: 'Includes',
  },
  'Managed Services': {
    type: 'Service Type', scope: 'Scope', response_time: 'Response Time',
    sla: 'SLA', coverage: 'Coverage Hours', includes: 'Includes',
    platform: 'Platform', term: 'Contract Term',
  },
  'Audio & Headsets': {
    type: 'Type', connection: 'Connection', noise_cancellation: 'Noise Cancellation',
    microphone: 'Microphone', battery: 'Battery Life', platform: 'Platform',
    certifications: 'Certifications', features: 'Features',
  },
  'Office Supplies': {
    type: 'Type', compatibility: 'Compatibility', yield: 'Page Yield',
    format: 'Format', colour: 'Colour', features: 'Features',
  },
  'Furniture & Ergonomics': {
    type: 'Type', load_capacity: 'Max Load', adjustment: 'Height Adjustment',
    material: 'Material', colour: 'Colour', features: 'Features',
    certifications: 'Certifications',
  },
};

export type Currency = 'GBP' | 'USD' | 'EUR';

export interface CartItem {
  sku: string;
  qty: number;
}

export const CURRENCY_RATES: Record<Currency, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.18,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: 'GBP',
  USD: 'USD',
  EUR: 'EUR',
};

export function formatMoney(value: number | null, currency: Currency = 'GBP'): string {
  if (value == null) return 'Quote';
  const converted = value * CURRENCY_RATES[currency];
  return `${currency} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const CATEGORY_ICONS: Record<string, string> = {
  // Hardware
  'Laptops & Computers': '🖥',
  'Monitors & Displays': '🖥',
  'Printers & Imaging': '🖨',
  'Servers & Data Centre': '🗄',
  'Storage': '💾',
  'Power & UPS': '⚡',
  'Tablets & Mobile': '📱',
  'Projectors & AV': '📽',
  'Components & Upgrades': '🔧',
  // Networking & Infrastructure
  'Networking': '🌐',
  'Cabling & Racks': '🔌',
  'Telephony & VoIP': '📞',
  // Security
  'CCTV & Security': '📷',
  'Cybersecurity': '🔒',
  'Access Control': '🚪',
  // Software & Services
  'Software & Licensing': '💿',
  'Cloud Services': '☁️',
  'Managed Services': '🛠',
  // Peripherals & AV
  'Accessories': '⌨',
  'Meeting & Collaboration': '📹',
  'Audio & Headsets': '🎧',
  // Office & Facilities
  'Office Supplies': '🖊',
  'Furniture & Ergonomics': '🪑',
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'Laptops & Computers': '/assets/categories/computers-laptops.png',
  'Monitors & Displays': '/assets/categories/monitors-displays.png',
  'Networking': '/assets/categories/networking.png',
  'Printers & Imaging': '/assets/categories/printers-consumables.png',
  'Software & Licensing': '/assets/categories/software-licensing.png',
  'CCTV & Security': '/assets/categories/security-storage.png',
};

export const FEATURED_CATEGORIES = [
  { name: 'Laptops & Computers',   image: '/assets/categories/computers-laptops.png',   slug: 'Laptops & Computers' },
  { name: 'Monitors & Displays',   image: '/assets/categories/monitors-displays.png',   slug: 'Monitors & Displays' },
  { name: 'Printers & Imaging',    image: '/assets/categories/printers-consumables.png',slug: 'Printers & Imaging' },
  { name: 'Networking',            image: '/assets/categories/networking.png',           slug: 'Networking' },
  { name: 'CCTV & Security',       image: '/assets/categories/security-storage.png',    slug: 'CCTV & Security' },
  { name: 'Software & Licensing',  image: '/assets/categories/software-licensing.png',  slug: 'Software & Licensing' },
  { name: 'Servers & Data Centre', image: '/assets/categories/computers-laptops.png',   slug: 'Servers & Data Centre' },
  { name: 'Storage',               image: '/assets/categories/security-storage.png',    slug: 'Storage' },
  { name: 'Tablets & Mobile',      image: '/assets/categories/computers-laptops.png',   slug: 'Tablets & Mobile' },
  { name: 'Telephony & VoIP',      image: '/assets/categories/networking.png',          slug: 'Telephony & VoIP' },
  { name: 'Cloud Services',        image: '/assets/categories/software-licensing.png',  slug: 'Cloud Services' },
  { name: 'Audio & Headsets',      image: '/assets/categories/monitors-displays.png',   slug: 'Audio & Headsets' },
];
