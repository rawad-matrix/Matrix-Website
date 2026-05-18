export function MapSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5 pt-16 pb-8">
        <div className="flex items-start gap-4">
          <div className="w-[3px] self-stretch bg-[#1B6FCC] rounded-full flex-shrink-0 mt-1" />
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#1B6FCC] block mb-1">Find Us</span>
            <h3 className="font-barlow font-extrabold text-[28px] uppercase text-[#1F2330] m-0 leading-none">
              Matrix Energy & Automation
            </h3>
            <p className="font-dm text-[14px] text-[#64748B] mt-2 mb-0">
              3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon
            </p>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden" style={{ height: '450px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8!2d35.5004!3d33.7853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17bdf20b4d03%3A0x7e7b8a3adf5bdf7f!2sKhaldeh%2C%20Lebanon!5e0!3m2!1sen!2s!4v1"
          width="100%"
          height="450"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Matrix EA — Khaldeh, Beirut"
        />
      </div>
    </section>
  )
}
