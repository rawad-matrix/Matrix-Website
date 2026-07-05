// ── Editable site text registry ─────────────────────────────────────────────
// Every text block that can be edited from the admin panel (/admin/texts) is
// declared here. The admin UI is generated from this registry, and each page
// falls back to the `def` value when no override exists in site_settings.
//
// DB storage: site_settings rows with key = `text:<block key>`.
// Structure (layout, colors, order) is fixed in code — only strings change.

export type TextBlock = { key: string; label: string; def: string; multiline?: boolean }
export type TextSection = { section: string; blocks: TextBlock[] }
export type TextPage = { page: string; sections: TextSection[] }

export const TEXT_PREFIX = 'text:'

export const SITE_TEXT_PAGES: TextPage[] = [
  {
    page: 'Homepage',
    sections: [
      {
        section: 'Hero',
        blocks: [
          { key: 'home.hero.tag', label: 'Tag pill (above title)', def: 'Automation & Energy Solutions' },
          { key: 'home.hero.title1', label: 'Title — part 1', def: 'Powering' },
          { key: 'home.hero.title_outline', label: 'Title — outlined word', def: "Lebanon's" },
          { key: 'home.hero.title2', label: 'Title — part 2 (second line)', def: 'Industrial' },
          { key: 'home.hero.title_accent', label: 'Title — red word', def: 'Future.' },
          { key: 'home.hero.lead', label: 'Lead paragraph', multiline: true, def: "21 years of SCADA, PLC, and system integration experience across Lebanon, Iraq, Saudi Arabia and Africa. Turnkey EPC delivery, 24/7 maintenance, and hands-on training that builds your team's independence." },
          { key: 'home.hero.cta1', label: 'Blue button', def: 'Explore Solutions' },
          { key: 'home.hero.cta2', label: 'Ghost button', def: 'Our Case Studies' },
        ],
      },
      {
        section: 'Services Grid',
        blocks: [
          { key: 'home.services.label', label: 'Section label', def: 'What We Do' },
          { key: 'home.services.title', label: 'Section title', def: 'Engineering Solutions That Work.' },
          { key: 'home.services.card1.title', label: 'Card 1 — title', def: 'System Integrator' },
          { key: 'home.services.card1.desc', label: 'Card 1 — description', multiline: true, def: 'Turnkey EPC delivery — engineering, procurement, and construction of complete industrial automation platforms across the region.' },
          { key: 'home.services.card2.title', label: 'Card 2 — title', def: 'Academic Training' },
          { key: 'home.services.card2.desc', label: 'Card 2 — description', multiline: true, def: 'Face-to-face programs at the Matrix facility for students and fresh graduates. PLC, SCADA, TIA Portal and beyond.' },
          { key: 'home.services.card3.title', label: 'Card 3 — title', def: 'On-the-Job Training' },
          { key: 'home.services.card3.desc', label: 'Card 3 — description', multiline: true, def: 'Customized curriculum delivered at your facility or university. Built around your processes, your team.' },
          { key: 'home.services.card4.title', label: 'Card 4 — title', def: 'Hybrid Training' },
          { key: 'home.services.card4.desc', label: 'Card 4 — description', multiline: true, def: 'Online sessions paired with in-person labs. Flexible scheduling for distributed teams who need real hands-on practice.' },
          { key: 'home.services.card5.title', label: 'Card 5 — title', def: 'PLC & SCADA Courses' },
          { key: 'home.services.card5.desc', label: 'Card 5 — description', multiline: true, def: 'Structured tracks on Siemens TIA Portal, Allen Bradley, Delta and Veichi — beginner to advanced, with certified outcomes.' },
          { key: 'home.services.card6.title', label: 'Card 6 — title (Coming Soon)', def: 'Online Education Platform' },
          { key: 'home.services.card6.desc', label: 'Card 6 — description', multiline: true, def: 'A dedicated digital learning portal — self-paced modules, lab simulations, and certification tracks. Details to follow.' },
        ],
      },
      {
        section: 'Why Matrix',
        blocks: [
          { key: 'home.why.label', label: 'Section label', def: 'Our Edge' },
          { key: 'home.why.title', label: 'Section title', def: 'Why Choose Matrix EA' },
          { key: 'home.why.badge', label: 'Photo badge text (next to years)', def: 'Years of Engineering Excellence' },
          { key: 'home.why.item1.title', label: 'Checklist 1 — title', def: '21 Years of Specialized Experience' },
          { key: 'home.why.item1.desc', label: 'Checklist 1 — description', def: 'Serving Lebanon, Iraq, Saudi Arabia and Africa since 2005.' },
          { key: 'home.why.item2.title', label: 'Checklist 2 — title', def: 'Certified Siemens & ABB Partners' },
          { key: 'home.why.item2.desc', label: 'Checklist 2 — description', def: 'Authorised distributor and service provider for Siemens and ABB automation.' },
          { key: 'home.why.item3.title', label: 'Checklist 3 — title', def: '24/7 Maintenance Support' },
          { key: 'home.why.item3.desc', label: 'Checklist 3 — description', def: 'Round-the-clock remote monitoring and on-site response across the region.' },
          { key: 'home.why.item4.title', label: 'Checklist 4 — title', def: 'Turnkey EPC Delivery' },
          { key: 'home.why.item4.desc', label: 'Checklist 4 — description', def: 'We own the project from engineering through procurement to commissioning.' },
          { key: 'home.why.item5.title', label: 'Checklist 5 — title', def: 'Training & Knowledge Transfer' },
          { key: 'home.why.item5.desc', label: 'Checklist 5 — description', def: 'Every project includes optional hands-on operator and technician training.' },
          { key: 'home.why.cta1', label: 'Blue button', def: 'Our Services' },
          { key: 'home.why.cta2', label: 'Ghost button', def: 'Get a Quote' },
        ],
      },
      {
        section: 'Training Banner',
        blocks: [
          { key: 'home.training.label', label: 'Section label', def: 'Training Programs' },
          { key: 'home.training.title', label: 'Section title', def: 'Build In-House Engineering Capability' },
          { key: 'home.training.lead', label: 'Paragraph', multiline: true, def: 'From beginner PLC operators to advanced SCADA engineers — our structured training programs are built and delivered by working automation engineers, not classroom instructors.' },
          { key: 'home.training.cta', label: 'Button', def: 'Explore Training Programs' },
          { key: 'home.training.track1.title', label: 'Track 1 — title', def: 'Academic Training' },
          { key: 'home.training.track1.desc', label: 'Track 1 — description', def: 'Structured courses with lab sessions and certification.' },
          { key: 'home.training.track2.title', label: 'Track 2 — title', def: 'On-the-Job Training' },
          { key: 'home.training.track2.desc', label: 'Track 2 — description', def: 'Delivered on your plant floor using your live equipment.' },
          { key: 'home.training.track3.title', label: 'Track 3 — title', def: 'Hybrid Learning' },
          { key: 'home.training.track3.desc', label: 'Track 3 — description', def: 'Self-paced theory combined with intensive hands-on lab days.' },
        ],
      },
      {
        section: 'Partners / Brands',
        blocks: [
          { key: 'home.brands.label', label: 'Section label', def: 'Our Partners' },
          { key: 'home.brands.title', label: 'Section title', def: 'Trusted by Industry' },
          { key: 'home.brands.subtitle', label: 'Section subtitle', multiline: true, def: "Authorised partner and integrator for the world's leading industrial automation brands." },
        ],
      },
      {
        section: 'Map / Find Us',
        blocks: [
          { key: 'home.map.label', label: 'Section label', def: 'Find Us' },
          { key: 'home.map.title', label: 'Section title', def: 'Matrix Energy & Automation' },
          { key: 'home.map.subtitle', label: 'Address line', def: '3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon' },
        ],
      },
    ],
  },
  {
    page: 'About',
    sections: [
      {
        section: 'Page Hero',
        blocks: [
          { key: 'about.hero.title', label: 'Page title', def: 'About Matrix EA' },
          { key: 'about.hero.subtitle', label: 'Page subtitle', def: '21 years of engineering excellence across the Arab world and Africa.' },
        ],
      },
      {
        section: 'Our Story',
        blocks: [
          { key: 'about.story.label', label: 'Section label', def: 'Our Story' },
          { key: 'about.story.title', label: 'Section title', def: 'Born on the Factory Floor.' },
          { key: 'about.story.p1', label: 'Paragraph 1', multiline: true, def: 'Matrix Energy & Automation sarl was founded in Beirut in 2005 with a simple premise: industrial automation should be designed and delivered by engineers who understand both the theory and the reality of plant floor operation.' },
          { key: 'about.story.p2', label: 'Paragraph 2', multiline: true, def: 'Over two decades, we have grown from a local system integrator to a regional leader with completed projects in Lebanon, Iraq, Saudi Arabia, Angola, Nigeria, across Africa and beyond. Our team of 15+ engineers has commissioned systems in water treatment, food processing, power generation, steam plants, solar systems, pharmaceutical manufacturing and heavy industry.' },
          { key: 'about.story.p3', label: 'Paragraph 3', multiline: true, def: 'We remain privately held and engineering-first. Every project is owned by a senior engineer from scoping through commissioning.' },
        ],
      },
      {
        section: 'Mission Box',
        blocks: [
          { key: 'about.mission.title', label: 'Box title', def: 'Our Mission' },
          { key: 'about.mission.p', label: 'Mission paragraph', multiline: true, def: 'To deliver automation and energy solutions that genuinely improve plant performance, reduce downtime and transfer real knowledge to client teams — so they become more independent with every project we complete together.' },
          { key: 'about.mission.item1', label: 'Bullet 1', def: 'Engineering-first culture' },
          { key: 'about.mission.item2', label: 'Bullet 2', def: 'Knowledge transfer in every project' },
          { key: 'about.mission.item3', label: 'Bullet 3', def: 'Regional expertise, global standards' },
        ],
      },
      {
        section: 'History Timeline',
        blocks: [
          { key: 'about.history.label', label: 'Section label', def: 'History' },
          { key: 'about.history.title', label: 'Section title', def: 'Two Decades of Growth.' },
          { key: 'about.timeline.1.year', label: 'Entry 1 — year', def: '2005' },
          { key: 'about.timeline.1.title', label: 'Entry 1 — title', def: 'Founded in Beirut' },
          { key: 'about.timeline.1.desc', label: 'Entry 1 — description', multiline: true, def: 'Matrix EA established as a system integration firm focused on PLC and SCADA automation for Lebanese industry.' },
          { key: 'about.timeline.2.year', label: 'Entry 2 — year', def: '2011' },
          { key: 'about.timeline.2.title', label: 'Entry 2 — title', def: 'Regional Expansion' },
          { key: 'about.timeline.2.desc', label: 'Entry 2 — description', multiline: true, def: 'Opened project offices in Iraq and Saudi Arabia, completing major water and industrial automation projects.' },
          { key: 'about.timeline.3.year', label: 'Entry 3 — year', def: '2015' },
          { key: 'about.timeline.3.title', label: 'Entry 3 — title', def: 'Training Division Launched' },
          { key: 'about.timeline.3.desc', label: 'Entry 3 — description', multiline: true, def: 'Established the Matrix EA Training Centre, delivering accredited PLC, SCADA and EPLAN courses.' },
          { key: 'about.timeline.4.year', label: 'Entry 4 — year', def: '2019' },
          { key: 'about.timeline.4.title', label: 'Entry 4 — title', def: 'Energy Division' },
          { key: 'about.timeline.4.desc', label: 'Entry 4 — description', multiline: true, def: "Added solar and battery storage design to our portfolio, responding to Lebanon's energy crisis." },
          { key: 'about.timeline.5.year', label: 'Entry 5 — year', def: '2023' },
          { key: 'about.timeline.5.title', label: 'Entry 5 — title', def: 'Digital Platform' },
          { key: 'about.timeline.5.desc', label: 'Entry 5 — description', multiline: true, def: 'Launched online course catalog and live IoT monitoring platform for remote client sites.' },
        ],
      },
    ],
  },
  {
    page: 'Shared / Global',
    sections: [
      {
        section: 'Blue Contact Strip (bottom of pages)',
        blocks: [
          { key: 'shared.contactstrip.title', label: 'Title', def: 'Ready to discuss your project?' },
          { key: 'shared.contactstrip.subtitle', label: 'Subtitle', def: "Let's talk — call, email or chat on WhatsApp." },
          { key: 'shared.contactstrip.cta1', label: 'Dark button', def: 'Contact Us' },
          { key: 'shared.contactstrip.cta2', label: 'WhatsApp button', def: 'Chat on WhatsApp' },
        ],
      },
    ],
  },
]

// Flat map of key → default text, built once from the registry.
export const TEXT_DEFAULTS: Record<string, string> = Object.fromEntries(
  SITE_TEXT_PAGES.flatMap(p => p.sections.flatMap(s => s.blocks.map(b => [b.key, b.def])))
)

// Extract text overrides from a raw site_settings map (strips the `text:` prefix).
export function textOverridesFrom(settings: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(settings)) {
    if (k.startsWith(TEXT_PREFIX) && v) out[k.slice(TEXT_PREFIX.length)] = v
  }
  return out
}

// Lookup helper: override → registry default → empty string.
export function makeTx(overrides?: Record<string, string>) {
  return (key: string): string => overrides?.[key] ?? TEXT_DEFAULTS[key] ?? ''
}
