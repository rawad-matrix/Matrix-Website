import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  // Verify caller is an admin
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use service role to list all auth users
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: authData, error: usersError } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
  if (usersError) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // Fetch all profiles
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('id, full_name, phone, company, role, created_at')

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))

  const users = authData.users.map(u => {
    const p = profileMap.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      full_name: p?.full_name ?? null,
      phone: p?.phone ?? null,
      company: p?.company ?? null,
      role: (p?.role ?? 'student') as 'student' | 'admin',
    }
  })

  // Sort: admins first, then by join date desc
  users.sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (b.role === 'admin' && a.role !== 'admin') return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return NextResponse.json({ users })
}
