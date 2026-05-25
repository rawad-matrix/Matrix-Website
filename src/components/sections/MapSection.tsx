import { SectionHeader } from '@/components/ui/SectionHeader'

export function MapSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 pt-14 pb-6">
        <SectionHeader
          label="Find Us"
          title="Matrix Energy & Automation"
          subtitle="3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon"
          className="mb-0"
        />
      </div>
      <div className="w-full overflow-hidden rounded-xs" style={{ height: '460px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8!2d35.5004!3d33.7853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17bdf20b4d03%3A0x7e7b8a3adf5bdf7f!2sKhaldeh%2C%20Lebanon!5e0!3m2!1sen!2s!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Matrix EA — Khaldeh, Beirut"
        />
      </div>
    </section>
  )
}
