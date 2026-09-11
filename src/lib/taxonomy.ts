/**
 * Product Taxonomy
 *
 * Maps the user-facing top-level groups to subcategories,
 * which map to the actual `category` values in products.json.
 */

export interface Subcategory {
  label: string;          // display name
  categories: string[];   // actual product.category values that fall here
  icon: string;           // emoji used on the card
  description: string;    // one-liner shown on the card
}

export interface TopCategory {
  id: string;             // URL slug
  label: string;
  icon: string;
  colour: string;         // Tailwind bg class for the hero band
  description: string;
  subcategories: Subcategory[];
}

export const TAXONOMY: TopCategory[] = [
  {
    id: 'hardware',
    label: 'Hardware',
    icon: '🖥️',
    colour: 'bg-blue-950',
    description: 'Physical computing and infrastructure equipment — from desktops to data-centre servers.',
    subcategories: [
      {
        label: 'Laptops & Desktops',
        categories: ['Laptops & Computers'],
        icon: '💻',
        description: 'Business laptops, workstations and desktop PCs',
      },
      {
        label: 'Tablets & Mobile',
        categories: ['Tablets & Mobile'],
        icon: '📱',
        description: 'Business tablets, smartphones and rugged handhelds',
      },
      {
        label: 'Monitors & Displays',
        categories: ['Monitors & Displays'],
        icon: '🖥️',
        description: 'Full HD, 4K and curved business monitors',
      },
      {
        label: 'Projectors & AV',
        categories: ['Projectors & AV'],
        icon: '📽️',
        description: 'Laser and lamp projectors for presentations and signage',
      },
      {
        label: 'Printers & Imaging',
        categories: ['Printers & Imaging'],
        icon: '🖨️',
        description: 'Laser and inkjet printers for the office',
      },
      {
        label: 'Servers & Data Centre',
        categories: ['Servers & Data Centre'],
        icon: '🗄️',
        description: 'Rack servers, blade systems and hyper-converged infrastructure',
      },
      {
        label: 'Storage',
        categories: ['Storage'],
        icon: '💾',
        description: 'SSDs, HDDs, NAS appliances and storage arrays',
      },
      {
        label: 'Components & Upgrades',
        categories: ['Components & Upgrades'],
        icon: '🔧',
        description: 'Memory, CPUs, GPUs and system upgrade components',
      },
      {
        label: 'Power & UPS',
        categories: ['Power & UPS'],
        icon: '⚡',
        description: 'Uninterruptible power supplies and power management',
      },
    ],
  },
  {
    id: 'networking',
    label: 'Networking & Infrastructure',
    icon: '🌐',
    colour: 'bg-sky-950',
    description: 'Switches, routers, cabling, racks and unified communications infrastructure.',
    subcategories: [
      {
        label: 'Networking',
        categories: ['Networking'],
        icon: '📡',
        description: 'Switches, routers, access points and firewalls',
      },
      {
        label: 'Cabling & Racks',
        categories: ['Cabling & Racks'],
        icon: '🔌',
        description: 'Network cables, patch panels and server racks',
      },
      {
        label: 'Telephony & VoIP',
        categories: ['Telephony & VoIP'],
        icon: '📞',
        description: 'IP desk phones, DECT handsets and VoIP systems',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: '🔒',
    colour: 'bg-red-950',
    description: 'Physical and digital security — CCTV, access control, endpoint protection and cyber defence.',
    subcategories: [
      {
        label: 'CCTV & Surveillance',
        categories: ['CCTV & Security'],
        icon: '📷',
        description: 'IP cameras, NVRs and video management systems',
      },
      {
        label: 'Access Control',
        categories: ['Access Control'],
        icon: '🚪',
        description: 'Card readers, biometric terminals and door entry systems',
      },
      {
        label: 'Cybersecurity',
        categories: ['Cybersecurity'],
        icon: '🛡️',
        description: 'Endpoint protection, firewalls and security software',
      },
    ],
  },
  {
    id: 'software',
    label: 'Software & Cloud',
    icon: '💿',
    colour: 'bg-purple-950',
    description: 'Licensing, SaaS subscriptions and cloud services — from OS to productivity and security.',
    subcategories: [
      {
        label: 'Software & Licensing',
        categories: ['Software & Licensing'],
        icon: '💿',
        description: 'Windows, Office, server OS and volume licensing',
      },
      {
        label: 'Cloud Services',
        categories: ['Cloud Services'],
        icon: '☁️',
        description: 'Microsoft Azure, Microsoft 365 and hosted cloud platforms',
      },
      {
        label: 'Managed Services',
        categories: ['Managed Services'],
        icon: '🛠️',
        description: 'Fully managed IT support, monitoring and maintenance contracts',
      },
    ],
  },
  {
    id: 'peripherals',
    label: 'Peripherals & AV',
    icon: '🎧',
    colour: 'bg-green-950',
    description: 'Peripherals, audio-visual equipment and collaboration tools for the modern workplace.',
    subcategories: [
      {
        label: 'Meeting & Collaboration',
        categories: ['Meeting & Collaboration'],
        icon: '📹',
        description: 'Video conferencing cameras, speakerphones and room systems',
      },
      {
        label: 'Audio & Headsets',
        categories: ['Audio & Headsets'],
        icon: '🎧',
        description: 'Professional headsets, speakerphones and audio accessories',
      },
      {
        label: 'Accessories',
        categories: ['Accessories'],
        icon: '⌨️',
        description: 'Keyboards, mice, docking stations and input devices',
      },
    ],
  },
  {
    id: 'office',
    label: 'Office & Facilities',
    icon: '🏢',
    colour: 'bg-amber-950',
    description: 'Office supplies, consumables, furniture and ergonomic equipment.',
    subcategories: [
      {
        label: 'Office Supplies',
        categories: ['Office Supplies'],
        icon: '🖊️',
        description: 'Printer consumables, paper, labels and stationery',
      },
      {
        label: 'Furniture & Ergonomics',
        categories: ['Furniture & Ergonomics'],
        icon: '🪑',
        description: 'Sit-stand desks, monitor arms, chairs and ergonomic accessories',
      },
    ],
  },
];

/** Flat list of all product categories covered by the taxonomy */
export const ALL_MAPPED_CATEGORIES = new Set(
  TAXONOMY.flatMap(t => t.subcategories.flatMap(s => s.categories))
);
