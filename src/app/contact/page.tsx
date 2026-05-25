import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="Let's discuss your project. Our engineers are ready to help."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-2 gap-10 items-start max-[900px]:grid-cols-1">
            {/* Left: contact card */}
            <div
              className="rounded-xs p-10 text-white lg:sticky lg:top-8"
              style={{ background: '#2A2F3A' }}
            >
              <h2 className="font-barlow font-bold text-[32px] uppercase text-white mb-6">Contact Info</h2>
              <div className="flex flex-col gap-5 mb-8">
                {[
                  {
                    icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>,
                    label: '3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon',
                  },
                  {
                    icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>,
                    label: '+961 78 800 274',
                    href: 'tel:+96178800274',
                  },
                  {
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
                    label: 'info@matrixea.co',
                    href: 'mailto:info@matrixea.co',
                  },
                  {
                    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                    label: 'Mon–Sat 09:00 – 20:00 · Sunday Closed',
                  },
                ].map(({ icon, label, href }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div className="shrink-0 w-9 h-9 grid place-items-center bg-[rgba(27,111,204,.15)] rounded-xs text-matrix-blue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                    </div>
                    {href ? (
                      <a href={href} className="font-dm text-[14px] text-white/80 hover:text-white transition-colors mt-2.25">{label}</a>
                    ) : (
                      <span className="font-dm text-[14px] text-white/80 mt-2.25">{label}</span>
                    )}
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/96171483747"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-matrix-wa text-white px-6 py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:brightness-110 transition-all duration-150 mb-6"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2.1 3.2 5 4.4c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c-.1-.2-.3-.3-.6-.5zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Right: form */}
            <div className="bg-white rounded-xs p-10" style={{ border: '1px solid #E2E8F0' }}>
              <h2 className="font-barlow font-bold text-[32px] uppercase text-matrix-ink mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Maps embed */}
      <div className="overflow-hidden rounded-xs" style={{ height: '400px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8!2d35.5004!3d33.7853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17bdf20b4d03%3A0x7e7b8a3adf5bdf7f!2sKhaldeh%2C%20Lebanon!5e0!3m2!1sen!2s!4v1"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Matrix EA Location"
        />
      </div>
    </>
  )
}
