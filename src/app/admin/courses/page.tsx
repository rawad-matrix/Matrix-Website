'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../page'

type Course = {
  id: string
  title: string
  slug: string
  price: number
  level: string
  duration_hours: number
  is_published: boolean
  created_at: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchCourses = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('courses')
      .select('id, title, slug, price, level, duration_hours, is_published, created_at')
      .order('created_at', { ascending: false })
    if (data) setCourses(data)
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const togglePublish = async (id: string, current: boolean) => {
    setToggling(id)
    const supabase = createClient()
    await supabase.from('courses').update({ is_published: !current }).eq('id', id)
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !current } : c))
    setToggling(null)
  }

  const LEVEL_COLORS: Record<string, string> = {
    Beginner: '#22C55E', Intermediate: '#1B6FCC', Advanced: '#DC2626',
  }

  return (
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-matrix-ink leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-matrix-border">
              <h3 className="font-barlow font-bold uppercase text-[22px] tracking-[.04em] text-matrix-ink">
                Courses ({courses.length})
              </h3>
              <div className="text-[12px] text-matrix-muted">Toggle to publish / unpublish</div>
            </div>

            {loading ? (
              <div className="p-8 text-center font-mono text-[12px] text-matrix-muted tracking-widest">LOADING…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Title', 'Level', 'Duration', 'Price', 'Status', 'Published', ''].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10.5px] tracking-[.18em] uppercase text-matrix-muted font-semibold bg-matrix-off">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id} className="border-t border-matrix-border hover:bg-matrix-off">
                        <td className="px-6 py-3">
                          <div className="font-medium text-matrix-ink">{course.title}</div>
                          <div className="font-mono text-[11px] text-matrix-muted mt-0.5">{course.slug}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-block font-mono text-[10.5px] px-2 py-1 uppercase tracking-widest"
                            style={{ border: `1px solid ${LEVEL_COLORS[course.level] ?? '#E2E8F0'}`, color: LEVEL_COLORS[course.level] ?? '#64748B', borderRadius: '2px' }}
                          >
                            {course.level}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-[12.5px] text-matrix-muted">{course.duration_hours}h</td>
                        <td className="px-6 py-3 font-mono text-[13px] text-matrix-ink font-medium">${course.price}</td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-block text-[10.5px] px-2 py-1 font-semibold tracking-widest uppercase rounded-xs"
                            style={{
                              background: course.is_published ? 'rgba(34,197,94,.12)' : 'rgba(100,116,139,.1)',
                              color: course.is_published ? '#16A34A' : '#64748B',
                            }}
                          >
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => togglePublish(course.id, course.is_published)}
                            disabled={toggling === course.id}
                            className="relative w-10 h-5 rounded-full transition-colors"
                            style={{
                              background: course.is_published ? '#1B6FCC' : '#E2E8F0',
                              border: 'none',
                              cursor: 'pointer',
                              opacity: toggling === course.id ? 0.5 : 1,
                            }}
                            aria-label={course.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"
                              style={{
                                left: course.is_published ? 'calc(100% - 18px)' : '2px',
                                boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                              }}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-dm font-semibold uppercase text-[11px] px-2.5 py-1.5 text-matrix-muted"
                              style={{ border: '1px solid #E2E8F0', borderRadius: '2px' }}
                            >
                              View
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
