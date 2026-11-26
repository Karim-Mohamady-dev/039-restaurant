import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BowlFood, Clock, List, MapPin, X } from '@phosphor-icons/react'
import { tr, trArr, trObjArr, type Lang } from './i18n'

type FaqItem = { q: string; a: string }
type MenuItem = { name: string; desc: string; price: string; cat: string; tag: string; image: string }
type Day = { d: string; h: string }

function Tagline({ text }: { text: string }) {
  const words = text.split(' ')
  const [visible, setVisible] = useState(0)
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let i = 0
        const t = setInterval(() => { i += 1; setVisible(i); if (i >= words.length) clearInterval(t) }, 90)
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <p ref={ref} className="heading-3 max-w-[680px] mx-auto text-center" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="motion-base inline-block" style={{ opacity: i < visible ? 1 : 0.3 }}>{w}{i < words.length - 1 ? '\u00a0' : ''}</span>
      ))}
    </p>
  )
}

const GALLERY_IMAGES = [
  'https://images.pexels.com/photos/31071253/pexels-photo-31071253/free-photo-of-modern-restaurant-interior-with-wooden-ceiling-design.jpeg?cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/13871340/pexels-photo-13871340.jpeg?cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/39640990/pexels-photo-39640990/free-photo-of-chef-preparing-elegant-seafood-dinner-for-guests.jpeg?cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/4393017/pexels-photo-4393017.jpeg?cs=tinysrgb&dpr=1&w=500',
]

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('039-lang') === 'ar' ? 'ar' : 'en'))
  const [menuOpen, setMenuOpen] = useState(false)
  const [cat, setCat] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null)
  const [cookie, setCookie] = useState(() => localStorage.getItem('039-cookie') !== null)
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', party: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const t = useMemo(() => (p: string) => tr(lang, p), [lang])
  const menu = trObjArr<MenuItem>(lang, 'menu.items')
  const cats = trArr(lang, 'menu.categories')
  const faqs = trObjArr<FaqItem>(lang, 'faq.items')
  const days = trObjArr<Day>(lang, 'hours.days')
  const galleryItems = trArr(lang, 'gallery.items')
  const times = trArr(lang, 'reservation.times')
  const partyOptions = trArr(lang, 'reservation.partyOptions')
  const activeCat = cat ?? cats[0]
  const shown = menu.filter((m) => m.cat === activeCat)

  useEffect(() => {
    localStorage.setItem('039-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const navItems = [['#menu', t('nav.menu')], ['#gallery', t('nav.gallery')], ['#visit', t('nav.visit')], ['#faq', t('nav.faq')], ['#reserve', t('nav.reserve')]] as const

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = t('reservation.errors.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('reservation.errors.email')
    if (!form.date || new Date(form.date) <= new Date(new Date().toDateString())) errs.date = t('reservation.errors.date')
    if (!form.party) errs.party = t('reservation.errors.party')
    setErrors(errs)
    if (Object.keys(errs).length === 0) setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#faf6ef] text-[#1f3d2b] overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[#1f3d2b] focus:text-white focus:px-4 focus:py-2">Skip to content</a>
      <header className="fixed top-4 inset-x-4 z-40 flex justify-center">
        <nav aria-label="Main" className="flex items-center gap-4 rounded-2xl bg-[#faf6ef]/90 backdrop-blur px-4 py-2 border border-[#e3d9c8] max-w-full shadow-sm">
          <a href="#top" className="title-2 font-semibold shrink-0 flex items-center gap-2"><BowlFood size={22} className="text-[#b4552d]" /> Saffron Table</a>
          <div className="hidden md:flex items-center gap-4">
            {navItems.map(([href, label]) => <a key={href} href={href} className="body-6 text-[#4a5d50] hover:text-[#1f3d2b] motion-hover">{label}</a>)}
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="button-sm rounded-lg bg-[#1f3d2b] text-white px-3 py-2 active:scale-[0.98] motion-hover shrink-0">{t('nav.lang')}</button>
          <a href="#reserve" className="button-sm hidden sm:inline-block rounded-lg bg-[#b4552d] text-white px-3 py-2 active:scale-[0.98] motion-hover">{t('nav.reserve')}</a>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="md:hidden p-2 rounded-lg border border-[#e3d9c8]">{menuOpen ? <X size={20} /> : <List size={20} />}</button>
        </nav>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-[#faf6ef]/95 backdrop-blur pt-24 px-8 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map(([href, label], i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="heading-5 motion-base" style={{ transitionDelay: `${i * 60}ms` }}>{label}</a>
            ))}
          </div>
        </div>
      )}
      <main id="main">
        <section id="top" className="px-4 pt-32 pb-16 md:pt-40">
          <div className="max-w-[680px] mx-auto text-center">
            <p className="caption-4 text-[#b4552d] mb-4">{t('hero.eyebrow')}</p>
            <h1 className="heading-1 hero-gradient-light">{t('hero.title')}</h1>
            <p className="body-3 text-[#4a5d50] mt-6">{t('hero.sub')}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="#reserve" className="button-md rounded-xl bg-[#1f3d2b] text-white px-3 py-2 inline-flex items-center gap-2 active:scale-[0.98] motion-hover">{t('hero.cta')} <ArrowRight size={18} /></a>
              <a href="#menu" className="button-md rounded-xl border border-[#1f3d2b] px-3 py-2 active:scale-[0.98] motion-hover">{t('hero.secondary')}</a>
            </div>
            <p className="caption-2 text-[#777777] mt-6">{t('hero.proof')}</p>
          </div>
          <div className="max-w-4xl mx-auto mt-16 rounded-2xl bg-[#1f3d2b] text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <BowlFood size={64} className="text-[#e8c87a] shrink-0" />
            <div>
              <h2 className="heading-5">{t('story.title')}</h2>
              <p className="body-6 text-[#d4e0d6] mt-2">{t('story.sub')}</p>
            </div>
          </div>
        </section>
        <section className="px-4 py-16 md:py-24"><Tagline text={t('tagline')} /></section>
        <section id="menu" className="px-4 py-16 md:py-24 max-w-4xl mx-auto">
          <h2 className="heading-3 text-center">{t('menu.title')}</h2>
          <p className="body-3 text-[#4a5d50] text-center mt-4">{t('menu.sub')}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-8" role="group" aria-label={t('menu.title')}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={activeCat === c} className={`button-sm rounded-full px-4 py-2 motion-hover ${activeCat === c ? 'bg-[#1f3d2b] text-white' : 'border border-[#1f3d2b]'}`}>{c}</button>
            ))}
          </div>
          <div className="mt-12 space-y-4">
            {shown.map((m) => (
              <article key={m.name} className="rounded-2xl border border-[#e3d9c8] bg-white p-6 flex flex-wrap items-start justify-between gap-4">
                <img src={m.image} alt={m.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-[200px] flex-1">
                  <h3 className="title-1">{m.name} {m.tag && <span className="caption-4 bg-[#eef2e8] text-[#1f3d2b] rounded-full px-3 py-1 ms-2">{m.tag}</span>}</h3>
                  <p className="body-6 text-[#555555] mt-2">{m.desc}</p>
                </div>
                <span className="title-2 text-[#b4552d] shrink-0">{m.price}</span>
              </article>
            ))}
          </div>
          <p className="caption-2 text-[#777777] text-center mt-6">{t('menu.note')}</p>
        </section>
        <section id="gallery" className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="heading-3 text-center">{t('gallery.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {galleryItems.map((g, i) => (
              <div key={g} className={`relative overflow-hidden rounded-2xl flex items-end p-4 ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square mt-8'}`}>
                <img src={GALLERY_IMAGES[i % GALLERY_IMAGES.length]} alt={g} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <span className="caption-4 relative bg-white/90 rounded-lg px-3 py-2">{g}</span>
              </div>
            ))}
          </div>
        </section>
        <section id="visit" className="px-4 py-16 md:py-24 max-w-4xl mx-auto">
          <h2 className="heading-3 text-center">{t('hours.title')}</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <article className="rounded-2xl border border-[#e3d9c8] bg-white p-8">
              <h3 className="title-1 flex items-center gap-2"><MapPin size={20} className="text-[#b4552d]" /> {t('nav.visit')}</h3>
              <p className="body-3 mt-4">{t('hours.address')}</p>
            </article>
            <article className="rounded-2xl border border-[#e3d9c8] bg-white p-8">
              <h3 className="title-1 flex items-center gap-2"><Clock size={20} className="text-[#b4552d]" /> {t('hours.title')}</h3>
              <ul className="mt-4 space-y-2">{days.map((d) => <li key={d.d} className="body-6 flex justify-between gap-4"><span>{d.d}</span><span>{d.h}</span></li>)}</ul>
            </article>
          </div>
        </section>
        <section id="faq" className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <h2 className="heading-3 text-center">{t('faq.title')}</h2>
          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-[#e3d9c8] bg-white">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="w-full flex justify-between items-center gap-4 text-start p-6">
                  <span className="title-3">{f.q}</span><span className="shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="body-6 text-[#555555] px-6 pb-6">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
        <section id="reserve" className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <h2 className="heading-3 text-center">{t('reservation.title')}</h2>
          <p className="body-3 text-[#4a5d50] text-center mt-4">{t('reservation.sub')}</p>
          {sent ? <p role="status" className="rounded-2xl border border-[#1f3d2b] bg-white p-8 text-center mt-12 body-2">{t('reservation.success')}</p> : (
            <form onSubmit={submit} noValidate className="mt-12 space-y-4">
              <div><label htmlFor="name" className="title-4 block mb-2">{t('reservation.name')}</label>
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-[#e3d9c8] bg-white px-4 py-3 body-3" />
                {errors.name && <p className="caption-2 text-red-700 mt-2">{errors.name}</p>}</div>
              <div><label htmlFor="email" className="title-4 block mb-2">{t('reservation.email')}</label>
                <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-[#e3d9c8] bg-white px-4 py-3 body-3" />
                {errors.email && <p className="caption-2 text-red-700 mt-2">{errors.email}</p>}</div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label htmlFor="date" className="title-4 block mb-2">{t('reservation.date')}</label>
                  <input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-[#e3d9c8] bg-white px-4 py-3 body-3" />
                  {errors.date && <p className="caption-2 text-red-700 mt-2">{errors.date}</p>}</div>
                <div><label htmlFor="time" className="title-4 block mb-2">{t('reservation.time')}</label>
                  <select id="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-xl border border-[#e3d9c8] bg-white px-4 py-3 body-3">
                    <option value="">{t('reservation.time')}</option>
                    {times.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label htmlFor="party" className="title-4 block mb-2">{t('reservation.guests')}</label>
                  <select id="party" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} className="w-full rounded-xl border border-[#e3d9c8] bg-white px-4 py-3 body-3">
                    <option value="">{t('reservation.guests')}</option>
                    {partyOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.party && <p className="caption-2 text-red-700 mt-2">{errors.party}</p>}</div>
              </div>
              <button type="submit" className="button-md w-full rounded-xl bg-[#1f3d2b] text-white px-3 py-2 active:scale-[0.98] motion-hover">{t('reservation.submit')}</button>
            </form>
          )}
        </section>
        <section className="px-4 py-16 md:py-24 text-center">
          <h2 className="heading-3 max-w-[680px] mx-auto">{t('final.title')}</h2>
          <a href="#reserve" className="button-md inline-flex items-center gap-2 rounded-xl bg-[#b4552d] text-white px-3 py-2 mt-8 active:scale-[0.98] motion-hover">{t('final.cta')} <ArrowRight size={18} /></a>
        </section>
      </main>
      <footer className="border border-[#e3d9c8] rounded-2xl mx-4 mb-4 p-8 bg-white">
        <p className="caption-2 text-[#777777]">{t('footer.note')}</p>
        <div className="flex gap-4 mt-4">
          <button onClick={() => setModal('privacy')} className="button-sm underline">{t('footer.privacy')}</button>
          <button onClick={() => setModal('terms')} className="button-sm underline">{t('footer.terms')}</button>
        </div>
      </footer>
      {modal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center"><h3 className="title-1">{modal === 'privacy' ? t('footer.privacy') : t('footer.terms')}</h3><button onClick={() => setModal(null)} aria-label="Close"><X size={20} /></button></div>
            <p className="body-6 text-[#555555] mt-4">{modal === 'privacy' ? t('footer.privacyText') : t('footer.termsText')}</p>
          </div>
        </div>
      )}
      {!cookie && (
        <div className="fixed bottom-4 inset-x-4 z-40 max-w-2xl mx-auto rounded-2xl bg-white border border-[#e3d9c8] shadow-md p-4 flex flex-wrap items-center gap-4 justify-between">
          <p className="body-6 flex-1 min-w-[200px]">{t('cookie.text')}</p>
          <div className="flex gap-2">
            <button onClick={() => { localStorage.setItem('039-cookie', 'accepted'); setCookie(true) }} className="button-sm rounded-lg bg-[#1f3d2b] text-white px-3 py-2">{t('cookie.accept')}</button>
            <button onClick={() => { localStorage.setItem('039-cookie', 'declined'); setCookie(true) }} className="button-sm rounded-lg border border-[#e3d9c8] px-3 py-2">{t('cookie.decline')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
