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
          { key: 'home.services.card3.title', label: 'Card 3 — title', def: 'In-House Training' },
          { key: 'home.services.card3.desc', label: 'Card 3 — description', multiline: true, def: 'Customized curriculum delivered at your facility or university. Built around your processes, your team.' },
          { key: 'home.services.card4.title', label: 'Card 4 — title', def: 'Hybrid Training' },
          { key: 'home.services.card4.desc', label: 'Card 4 — description', multiline: true, def: 'Online sessions paired with in-person labs. Flexible scheduling for distributed teams who need real hands-on practice.' },
          { key: 'home.services.card5.title', label: 'Card 5 — title (Coming Soon)', def: 'Online Education Platform' },
          { key: 'home.services.card5.desc', label: 'Card 5 — description', multiline: true, def: 'A dedicated digital learning portal — self-paced modules, lab simulations, and certification tracks. Details to follow.' },
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
          { key: 'home.why.item2.title', label: 'Checklist 2 — title', def: 'Leading Industrial Automation Solutions' },
          { key: 'home.why.item2.desc', label: 'Checklist 2 — description', def: "Providing engineering, supply, integration, and support for products from the world's leading automation manufacturers." },
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
          { key: 'home.training.track2.title', label: 'Track 2 — title', def: 'In-House Training' },
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
          { key: 'home.brands.subtitle', label: 'Section subtitle', multiline: true, def: "System integrator specialising in the world's leading industrial automation brands." },
        ],
      },
      {
        section: 'Map / Find Us',
        blocks: [
          { key: 'home.map.label', label: 'Section label', def: 'Find Us' },
          { key: 'home.map.title', label: 'Section title', def: 'Two Branches, One Team.' },
          { key: 'home.map.subtitle', label: 'Section subtitle', multiline: true, def: 'Matrix EA now serves you from two locations — Khaldeh (Beirut) and Sarba (Jounieh).' },
          { key: 'home.map.branch1.name', label: 'Branch 1 — name', def: 'Khaldeh — Beirut' },
          { key: 'home.map.branch1.address', label: 'Branch 1 — address', def: '3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon' },
          { key: 'home.map.branch2.name', label: 'Branch 2 — name', def: 'Sarba — Jounieh' },
          { key: 'home.map.branch2.address', label: 'Branch 2 — address', def: 'Sarba Highway, Jounieh — Lebanon' },
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
    page: 'System Integrator',
    sections: [
      {
        section: 'Page Hero',
        blocks: [
          { key: 'si.hero.title', label: 'Page title', def: 'System Integrator' },
          { key: 'si.hero.subtitle', label: 'Page subtitle', def: 'End-to-end EPC delivery for industrial automation and energy systems.' },
        ],
      },
      {
        section: 'Intro',
        blocks: [
          { key: 'si.intro.label', label: 'Section label', def: 'What We Do' },
          { key: 'si.intro.title', label: 'Section title', def: 'Full EPC System Integration.' },
          { key: 'si.intro.p1', label: 'Paragraph 1', multiline: true, def: 'Matrix EA delivers complete Engineering, Procurement and Construction packages for industrial automation projects. We own the project from first concept through commissioning handover — one point of contact, one contract, zero finger-pointing.' },
          { key: 'si.intro.p2', label: 'Paragraph 2', multiline: true, def: 'With 21 years and over 1,200 completed projects, we have delivered for water utilities, food processors, power plants, pharmaceutical manufacturers and OEMs across Lebanon, Iraq, Saudi Arabia and Africa.' },
        ],
      },
      {
        section: 'Why EPC Box',
        blocks: [
          { key: 'si.whyepc.title', label: 'Box title', def: 'Why EPC?' },
          { key: 'si.whyepc.item1', label: 'Bullet 1', def: 'Single-vendor accountability from design to commissioning' },
          { key: 'si.whyepc.item2', label: 'Bullet 2', def: 'Optimised lead times through parallel engineering and procurement' },
          { key: 'si.whyepc.item3', label: 'Bullet 3', def: 'Consistent documentation and standards throughout' },
          { key: 'si.whyepc.item4', label: 'Bullet 4', def: 'Reduced project risk with one experienced team' },
        ],
      },
      {
        section: 'EPC Cards',
        blocks: [
          { key: 'si.epc.label', label: 'Section label', def: 'Our Process' },
          { key: 'si.epc.title', label: 'Section title', def: 'Engineering. Procurement. Construction.' },
          { key: 'si.epc.e.title', label: 'E card — title', def: 'Engineering' },
          { key: 'si.epc.e.desc', label: 'E card — description', multiline: true, def: 'Feasibility studies, P&ID review, SCADA architecture design, panel schematics in EPLAN, FAT procedures and full documentation packages.' },
          { key: 'si.epc.e.item1', label: 'E card — bullet 1', def: 'Feasibility & scope definition' },
          { key: 'si.epc.e.item2', label: 'E card — bullet 2', def: 'P&ID and SCADA architecture' },
          { key: 'si.epc.e.item3', label: 'E card — bullet 3', def: 'Panel schematics (EPLAN)' },
          { key: 'si.epc.e.item4', label: 'E card — bullet 4', def: 'FAT / SAT procedures' },
          { key: 'si.epc.p.title', label: 'P card — title', def: 'Procurement' },
          { key: 'si.epc.p.desc', label: 'P card — description', multiline: true, def: 'Authorised supply of Siemens, ABB, Allen Bradley, Delta and Veichi automation equipment. Technical pre-sales, sizing and logistics managed in-house.' },
          { key: 'si.epc.p.item1', label: 'P card — bullet 1', def: 'Siemens / ABB / AB authorised' },
          { key: 'si.epc.p.item2', label: 'P card — bullet 2', def: 'Delta & Veichi authorised' },
          { key: 'si.epc.p.item3', label: 'P card — bullet 3', def: 'Technical pre-sales sizing' },
          { key: 'si.epc.p.item4', label: 'P card — bullet 4', def: 'Import logistics & customs' },
          { key: 'si.epc.c.title', label: 'C card — title', def: 'Construction' },
          { key: 'si.epc.c.desc', label: 'C card — description', multiline: true, def: 'Panel fabrication, site installation, cable management, instrument loop testing, PLC commissioning and operator handover training.' },
          { key: 'si.epc.c.item1', label: 'C card — bullet 1', def: 'Panel fabrication & wiring' },
          { key: 'si.epc.c.item2', label: 'C card — bullet 2', def: 'Site installation & cabling' },
          { key: 'si.epc.c.item3', label: 'C card — bullet 3', def: 'Loop testing & commissioning' },
          { key: 'si.epc.c.item4', label: 'C card — bullet 4', def: 'Operator handover training' },
        ],
      },
      {
        section: 'Technical Services',
        blocks: [
          { key: 'si.services.label', label: 'Section label', def: 'Capabilities' },
          { key: 'si.services.title', label: 'Section title', def: 'Technical Services.' },
          { key: 'si.services.card1.title', label: 'Card 1 — title', def: 'SCADA System Design' },
          { key: 'si.services.card1.desc', label: 'Card 1 — description', multiline: true, def: 'Custom SCADA solutions for water, energy and manufacturing using iFIX, WinCC and Ignition platforms.' },
          { key: 'si.services.card2.title', label: 'Card 2 — title', def: 'PLC Programming' },
          { key: 'si.services.card2.desc', label: 'Card 2 — description', multiline: true, def: 'Siemens S7-1200/1500, Allen Bradley CompactLogix/ControlLogix, Delta DVP/AS series.' },
          { key: 'si.services.card3.title', label: 'Card 3 — title', def: 'HMI Development' },
          { key: 'si.services.card3.desc', label: 'Card 3 — description', multiline: true, def: 'Intuitive operator interfaces on Siemens, Weintek, Weinview and Delta HMI panels.' },
          { key: 'si.services.card4.title', label: 'Card 4 — title', def: 'Network & Comms' },
          { key: 'si.services.card4.desc', label: 'Card 4 — description', multiline: true, def: 'Profinet, Profibus, Modbus TCP/RTU, OPC-UA and industrial Ethernet design.' },
          { key: 'si.services.card5.title', label: 'Card 5 — title', def: 'Legacy Upgrades' },
          { key: 'si.services.card5.desc', label: 'Card 5 — description', multiline: true, def: 'Migrating obsolete PLC/SCADA systems with minimal downtime and full data continuity.' },
          { key: 'si.services.card6.title', label: 'Card 6 — title', def: 'Cybersecurity' },
          { key: 'si.services.card6.desc', label: 'Card 6 — description', multiline: true, def: 'OT network segmentation, firewall configuration and ICS security assessments.' },
        ],
      },
      {
        section: 'Industries',
        blocks: [
          { key: 'si.industries.label', label: 'Section label', def: 'Sectors' },
          { key: 'si.industries.title', label: 'Section title', def: 'Industries We Serve.' },
          { key: 'si.industries.item1', label: 'Industry 1', def: 'Water & Wastewater' },
          { key: 'si.industries.item2', label: 'Industry 2', def: 'Food & Beverage' },
          { key: 'si.industries.item3', label: 'Industry 3', def: 'Pharmaceuticals' },
          { key: 'si.industries.item4', label: 'Industry 4', def: 'Oil & Gas' },
          { key: 'si.industries.item5', label: 'Industry 5', def: 'Power Generation' },
          { key: 'si.industries.item6', label: 'Industry 6', def: 'Building Automation' },
          { key: 'si.industries.item7', label: 'Industry 7', def: 'Manufacturing' },
          { key: 'si.industries.item8', label: 'Industry 8', def: 'Packaging' },
          { key: 'si.industries.item9', label: 'Industry 9', def: 'Mining & Quarrying' },
        ],
      },
      {
        section: 'Delivery Process',
        blocks: [
          { key: 'si.process.label', label: 'Section label', def: 'Methodology' },
          { key: 'si.process.title', label: 'Section title', def: 'How We Deliver.' },
          { key: 'si.process.step1.title', label: 'Step 1 — title', def: 'Scope & Feasibility' },
          { key: 'si.process.step1.desc', label: 'Step 1 — description', multiline: true, def: 'Site visit, existing system audit, requirements gathering and budget estimate.' },
          { key: 'si.process.step2.title', label: 'Step 2 — title', def: 'Engineering Design' },
          { key: 'si.process.step2.desc', label: 'Step 2 — description', multiline: true, def: 'Detailed engineering, P&ID, SCADA architecture, panel schematics and BOM.' },
          { key: 'si.process.step3.title', label: 'Step 3 — title', def: 'Procurement' },
          { key: 'si.process.step3.desc', label: 'Step 3 — description', multiline: true, def: 'Equipment sourcing, factory acceptance test (FAT) and logistics to site.' },
          { key: 'si.process.step4.title', label: 'Step 4 — title', def: 'Installation' },
          { key: 'si.process.step4.desc', label: 'Step 4 — description', multiline: true, def: 'Panel fabrication, site cabling, instrument installation and pre-commissioning.' },
          { key: 'si.process.step5.title', label: 'Step 5 — title', def: 'Commissioning' },
          { key: 'si.process.step5.desc', label: 'Step 5 — description', multiline: true, def: 'Loop testing, PLC/SCADA commissioning, site acceptance test (SAT).' },
          { key: 'si.process.step6.title', label: 'Step 6 — title', def: 'Handover & Support' },
          { key: 'si.process.step6.desc', label: 'Step 6 — description', multiline: true, def: 'Documentation package, operator training and ongoing maintenance agreement.' },
        ],
      },
    ],
  },
  {
    page: 'Training (Overview)',
    sections: [
      {
        section: 'Page Hero',
        blocks: [
          { key: 'training.hero.title', label: 'Page title', def: 'Training Programs' },
          { key: 'training.hero.subtitle', label: 'Page subtitle', def: 'Hands-on automation training delivered by engineers who deploy these systems every week.' },
        ],
      },
      {
        section: 'Learning Tracks',
        blocks: [
          { key: 'training.tracks.label', label: 'Section label', def: 'Learning Tracks' },
          { key: 'training.tracks.title', label: 'Section title', def: 'Three Ways to Learn.' },
          { key: 'training.track1.title', label: 'Track 1 — title', def: 'Academic Training' },
          { key: 'training.track1.desc', label: 'Track 1 — description', multiline: true, def: 'Structured cohort-based courses with lab sessions, assessments and a Matrix EA certificate. Best for individuals and teams building foundational skills.' },
          { key: 'training.track2.title', label: 'Track 2 — title', def: 'In-House Training' },
          { key: 'training.track2.desc', label: 'Track 2 — description', multiline: true, def: 'Training delivered on your own plant floor, on your live equipment and your actual processes. No travel, no downtime — skills transfer immediately.' },
          { key: 'training.track3.title', label: 'Track 3 — title', def: 'Hybrid Learning' },
          { key: 'training.track3.desc', label: 'Track 3 — description', multiline: true, def: 'Self-paced online theory modules combined with scheduled intensive lab days. Maximum flexibility for working professionals.' },
        ],
      },
      {
        section: 'Course Catalog',
        blocks: [
          { key: 'training.catalog.label', label: 'Section label', def: 'Course Catalog' },
          { key: 'training.catalog.title', label: 'Section title', def: 'Available Courses.' },
          { key: 'training.catalog.cta', label: 'Bottom button', def: 'Browse All Courses' },
        ],
      },
    ],
  },
  {
    page: 'Training — Academic',
    sections: [
      {
        section: 'Hero',
        blocks: [
          { key: 'tacademic.hero.title1', label: 'Title — first word(s)', def: 'Academic' },
          { key: 'tacademic.hero.accent', label: 'Title — accented word', def: 'Training.' },
          { key: 'tacademic.hero.subtitle', label: 'Subtitle', multiline: true, def: 'Face-to-face cohort programs at the Matrix facility. Structured curriculum, working PLC hardware, and instructors who commission real systems for a living.' },
          { key: 'tacademic.stat1.value', label: 'Stat — Format', def: 'In-person · Beirut' },
          { key: 'tacademic.stat2.value', label: 'Stat — Cohort Size', def: '8–12 students' },
          { key: 'tacademic.stat3.value', label: 'Stat — Duration', def: '4–12 weeks' },
          { key: 'tacademic.stat4.value', label: 'Stat — Schedule', def: 'Weekdays · 09:00–13:00' },
          { key: 'tacademic.stat5.value', label: 'Stat — Certificate', def: 'Matrix EA' },
          { key: 'tacademic.stat6.value', label: 'Stat — Next Intake', def: 'Sept 2026' },
        ],
      },
      {
        section: 'Curriculum',
        blocks: [
          { key: 'tacademic.modules.label', label: 'Section label', def: 'Curriculum' },
          { key: 'tacademic.modules.title', label: 'Section title', def: "What You'll Learn." },
          { key: 'tacademic.module1.title', label: 'Module 1 — title', def: 'PLC Fundamentals' },
          { key: 'tacademic.module1.desc', label: 'Module 1 — description', multiline: true, def: 'Ladder logic, function blocks, structured text. Hands-on wiring from day one using Siemens S7-1200 and Delta DVP hardware.' },
          { key: 'tacademic.module2.title', label: 'Module 2 — title', def: 'Siemens TIA Portal' },
          { key: 'tacademic.module2.desc', label: 'Module 2 — description', multiline: true, def: 'Full TIA Portal workflow — project setup, I/O configuration, program download, online diagnostics, and safety basics.' },
          { key: 'tacademic.module3.title', label: 'Module 3 — title', def: 'HMI Design' },
          { key: 'tacademic.module3.desc', label: 'Module 3 — description', multiline: true, def: 'Siemens WinCC Comfort and Unified panels. Screen navigation, alarms, trends, and user management for industrial UIs.' },
          { key: 'tacademic.module4.title', label: 'Module 4 — title', def: 'SCADA Architecture' },
          { key: 'tacademic.module4.desc', label: 'Module 4 — description', multiline: true, def: 'Data acquisition, historian, OPC-UA connectivity, and building supervisory dashboards using industry-standard platforms.' },
          { key: 'tacademic.module5.title', label: 'Module 5 — title', def: 'Drives & Motors' },
          { key: 'tacademic.module5.desc', label: 'Module 5 — description', multiline: true, def: 'VFD commissioning with Danfoss and Veichi drives, motor protection relay settings, and energy optimisation routines.' },
          { key: 'tacademic.module6.title', label: 'Module 6 — title', def: 'Capstone Project' },
          { key: 'tacademic.module6.desc', label: 'Module 6 — description', multiline: true, def: 'A full mini-automation system designed, wired, programmed, and presented by each team. Assessed by senior engineers.' },
        ],
      },
      {
        section: 'Who It’s For + CTA',
        blocks: [
          { key: 'tacademic.who.label', label: 'Section label', def: "Who It's For" },
          { key: 'tacademic.who.title', label: 'Section title', def: 'Ideal Candidates.' },
          { key: 'tacademic.who1.title', label: 'Card 1 — title', def: 'Fresh Engineering Grads' },
          { key: 'tacademic.who1.desc', label: 'Card 1 — description', multiline: true, def: 'EE, ME, or mechatronics graduates who need hands-on industrial experience before entering the workforce.' },
          { key: 'tacademic.who2.title', label: 'Card 2 — title', def: 'Career Switchers' },
          { key: 'tacademic.who2.desc', label: 'Card 2 — description', multiline: true, def: 'Professionals from IT, maintenance, or general engineering who want to move into industrial automation roles.' },
          { key: 'tacademic.who3.title', label: 'Card 3 — title', def: 'Final-Year Students' },
          { key: 'tacademic.who3.desc', label: 'Card 3 — description', multiline: true, def: 'University students who want to complete a technical internship with a verifiable capstone project and certificate.' },
          { key: 'tacademic.cta.title', label: 'CTA title', def: 'Ready to Enroll?' },
          { key: 'tacademic.cta.desc', label: 'CTA description', multiline: true, def: 'Next cohort starts September 2026. Limited to 12 seats. Apply early to secure your place.' },
          { key: 'tacademic.cta.button', label: 'CTA button', def: 'Request Application Form' },
        ],
      },
    ],
  },
  {
    page: 'Training — In-House',
    sections: [
      {
        section: 'Hero',
        blocks: [
          { key: 'tjob.hero.title1', label: 'Title — first word(s)', def: 'In-House' },
          { key: 'tjob.hero.accent', label: 'Title — accented word', def: 'Training.' },
          { key: 'tjob.hero.subtitle', label: 'Subtitle', multiline: true, def: 'We come to your facility. Real plant, real machines, real problems — your team learns by doing, not by watching slides in a classroom.' },
          { key: 'tjob.stat1.value', label: 'Stat — Format', def: 'On-site · Client facility' },
          { key: 'tjob.stat2.value', label: 'Stat — Group Size', def: '3–20 trainees' },
          { key: 'tjob.stat3.value', label: 'Stat — Duration', def: 'Custom · 1–8 weeks' },
          { key: 'tjob.stat4.value', label: 'Stat — Delivery', def: 'Lecture + lab + shadow' },
          { key: 'tjob.stat5.value', label: 'Stat — Certification', def: 'Matrix + brand-specific' },
          { key: 'tjob.stat6.value', label: 'Stat — Lead Time', def: '3–4 weeks' },
        ],
      },
      {
        section: 'The Four Phases',
        blocks: [
          { key: 'tjob.modules.label', label: 'Section label', def: 'How It Works' },
          { key: 'tjob.modules.title', label: 'Section title', def: 'The Four Phases.' },
          { key: 'tjob.module1.title', label: 'Phase 1 — title', def: 'Skills Audit' },
          { key: 'tjob.module1.desc', label: 'Phase 1 — description', multiline: true, def: 'We interview your team, review your equipment list, and audit current skill gaps before writing a single training objective.' },
          { key: 'tjob.module2.title', label: 'Phase 2 — title', def: 'Curriculum Design' },
          { key: 'tjob.module2.desc', label: 'Phase 2 — description', multiline: true, def: 'A tailored program is drafted around your specific PLCs, drives, and control systems — no generic off-the-shelf content.' },
          { key: 'tjob.module3.title', label: 'Phase 3 — title', def: 'On-Site Delivery', },
          { key: 'tjob.module3.desc', label: 'Phase 3 — description', multiline: true, def: 'Matrix instructors arrive on-site. Morning theory sessions, afternoon live-machine exercises, and shadowing on your actual control panels.' },
          { key: 'tjob.module4.title', label: 'Phase 4 — title', def: 'Assessment & Handoff' },
          { key: 'tjob.module4.desc', label: 'Phase 4 — description', multiline: true, def: 'Trainees complete a practical assessment on your equipment. We deliver a skills matrix report and recommend next steps.' },
        ],
      },
      {
        section: 'Who It’s For + CTA',
        blocks: [
          { key: 'tjob.who.label', label: 'Section label', def: "Who It's For" },
          { key: 'tjob.who.title', label: 'Section title', def: 'Best Fit Scenarios.' },
          { key: 'tjob.who1.title', label: 'Card 1 — title', def: 'Maintenance Teams' },
          { key: 'tjob.who1.desc', label: 'Card 1 — description', multiline: true, def: 'Technicians who maintain PLCs and drives daily but have never had formal training on the specific brands installed at their site.' },
          { key: 'tjob.who2.title', label: 'Card 2 — title', def: 'Universities & Institutes' },
          { key: 'tjob.who2.desc', label: 'Card 2 — description', multiline: true, def: 'Technical colleges seeking industrial-grade instruction delivered by practising engineers, not academic lecturers alone.' },
          { key: 'tjob.who3.title', label: 'Card 3 — title', def: 'Post-EPC Clients' },
          { key: 'tjob.who3.desc', label: 'Card 3 — description', multiline: true, def: 'Companies that just took over a Matrix-commissioned system and need their operations team trained on the exact hardware we installed.' },
          { key: 'tjob.cta.title', label: 'CTA title', def: 'Build a Program for Your Team.' },
          { key: 'tjob.cta.desc', label: 'CTA description', multiline: true, def: "Tell us about your facility and team size. We'll come back with a scoped proposal in 5 business days." },
          { key: 'tjob.cta.button', label: 'CTA button', def: 'Request a Program' },
        ],
      },
    ],
  },
  {
    page: 'Training — Hybrid',
    sections: [
      {
        section: 'Hero',
        blocks: [
          { key: 'thybrid.hero.title1', label: 'Title — first word(s)', def: 'Hybrid' },
          { key: 'thybrid.hero.accent', label: 'Title — accented word', def: 'Learning.' },
          { key: 'thybrid.hero.subtitle', label: 'Subtitle', multiline: true, def: "Live online theory every week. Hands-on lab intensives at Matrix HQ. Designed for engineers who can't leave their jobs but won't settle for video-only courses." },
          { key: 'thybrid.stat1.value', label: 'Stat — Format', def: 'Online + Lab visits' },
          { key: 'thybrid.stat2.value', label: 'Stat — Online Sessions', def: 'Weekly · 2 hours' },
          { key: 'thybrid.stat3.value', label: 'Stat — Lab Days', def: '2–4 visits to HQ' },
          { key: 'thybrid.stat4.value', label: 'Stat — Duration', def: '6–10 weeks' },
          { key: 'thybrid.stat5.value', label: 'Stat — Cohort Size', def: 'Up to 25 online' },
          { key: 'thybrid.stat6.value', label: 'Stat — Next Intake', def: 'Rolling' },
        ],
      },
      {
        section: 'Program Structure',
        blocks: [
          { key: 'thybrid.modules.label', label: 'Section label', def: 'Program Structure' },
          { key: 'thybrid.modules.title', label: 'Section title', def: 'How Each Week Runs.' },
          { key: 'thybrid.module1.title', label: 'Item 1 — title', def: 'Live Online Lectures' },
          { key: 'thybrid.module1.desc', label: 'Item 1 — description', multiline: true, def: 'Two-hour instructor-led sessions via video call. Recordings available 24 hours after each session for review.' },
          { key: 'thybrid.module2.title', label: 'Item 2 — title', def: 'Self-Paced Exercises' },
          { key: 'thybrid.module2.desc', label: 'Item 2 — description', multiline: true, def: 'Simulation exercises and reading tasks released after each lecture. Complete on your own schedule before the next session.' },
          { key: 'thybrid.module3.title', label: 'Item 3 — title', def: 'Lab Intensives' },
          { key: 'thybrid.module3.desc', label: 'Item 3 — description', multiline: true, def: 'Two to four full-day visits to the Matrix facility in Beirut. Real PLC racks, real wiring, real commissioning tasks.' },
          { key: 'thybrid.module4.title', label: 'Item 4 — title', def: 'Capstone Exam' },
          { key: 'thybrid.module4.desc', label: 'Item 4 — description', multiline: true, def: 'A timed practical assessment at the lab. Trainees configure, program, and fault-find a live control system from scratch.' },
          { key: 'thybrid.module5.title', label: 'Item 5 — title', def: 'Office Hours' },
          { key: 'thybrid.module5.desc', label: 'Item 5 — description', multiline: true, def: 'Weekly 30-minute open Q&A slot with the lead instructor. Ask anything — course content, career, or engineering problems on your current job.' },
          { key: 'thybrid.module6.title', label: 'Item 6 — title', def: 'Alumni Channel' },
          { key: 'thybrid.module6.desc', label: 'Item 6 — description', multiline: true, def: 'Private group for graduates. Ongoing peer support, job leads, and access to new course materials as the curriculum evolves.' },
        ],
      },
      {
        section: 'Who It’s For + CTA',
        blocks: [
          { key: 'thybrid.who.label', label: 'Section label', def: "Who It's For" },
          { key: 'thybrid.who.title', label: 'Section title', def: 'Who Thrives Here.' },
          { key: 'thybrid.who1.title', label: 'Card 1 — title', def: 'Working Engineers' },
          { key: 'thybrid.who1.desc', label: 'Card 1 — description', multiline: true, def: 'Employed engineers who want to upskill without taking time off. Online theory fits around shifts; lab visits are scheduled on weekends.' },
          { key: 'thybrid.who2.title', label: 'Card 2 — title', def: 'Regional Teams' },
          { key: 'thybrid.who2.desc', label: 'Card 2 — description', multiline: true, def: 'Engineers based outside Beirut who can travel for the lab intensives but need online delivery for the theory component.' },
          { key: 'thybrid.who3.title', label: 'Card 3 — title', def: 'Career Returners' },
          { key: 'thybrid.who3.desc', label: 'Card 3 — description', multiline: true, def: 'Professionals returning after a gap who need to refresh practical skills at a real control panel, not just re-read a textbook.' },
          { key: 'thybrid.cta.title', label: 'CTA title', def: 'Join the Next Cohort.' },
          { key: 'thybrid.cta.desc', label: 'CTA description', multiline: true, def: 'Rolling intakes — a new session begins every 4 weeks. Reserve your seat before it fills.' },
          { key: 'thybrid.cta.button', label: 'CTA button', def: 'Reserve Your Seat' },
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
