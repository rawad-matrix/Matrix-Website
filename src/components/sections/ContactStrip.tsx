import Link from 'next/link'

export function ContactStrip() {
  return (
    <section
      className="relative overflow-hidden py-7"
      style={{ background: '#1B6FCC', color: '#fff' }}
    >
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 flex justify-between items-center gap-8 flex-wrap">
        <div>
          <h3
            className="font-barlow font-bold uppercase text-white"
            style={{ fontSize: 'clamp(20px, 2.2vw, 26px)' }}
          >
            Ready to discuss your project?
            <small
              className="block font-dm font-normal normal-case text-[13.5px] text-white/85 mt-1"
              style={{ letterSpacing: 0 }}
            >
              Let's talk — call, email or chat on WhatsApp.
            </small>
          </h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-matrix-navy text-white px-5 py-3 font-dm font-semibold text-[12.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-black hover:-translate-y-px transition-all duration-150"
          >
            Contact Us
          </Link>
          <a
            href="https://wa.me/96178800274"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-matrix-wa text-white px-5 py-3 font-dm font-semibold text-[12.5px] uppercase tracking-[0.04em] rounded-xs hover:brightness-110 hover:-translate-y-px transition-all duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2.1 3.2 5 4.4c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c-.1-.2-.3-.3-.6-.5zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
