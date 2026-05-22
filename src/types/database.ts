export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  company: string | null
  role: 'student' | 'admin'
  avatar_url: string | null
  created_at: string
}

export type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  price: number
  currency: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null
  duration_hours: number | null
  format: string
  language: string
  cohort_size: string
  certificate: string
  modules: Json
  outcomes: Json
  prerequisites: string | null
  category: string | null
  is_published: boolean
  featured_image: string | null
  created_at: string
  updated_at: string
}

export type Enrollment = {
  id: string
  user_id: string
  course_id: string
  status: 'pending' | 'pending_payment' | 'active' | 'completed' | 'cancelled'
  payment_method: string | null
  payment_reference: string | null
  amount_paid: number | null
  enrolled_at: string
  completed_at: string | null
}

export type CaseStudy = {
  id: string
  title: string
  slug: string
  tag: string | null
  client: string | null
  sector: string | null
  year: number | null
  summary: string | null
  description: string | null
  systems_used: string[] | null
  image_url: string | null
  image_urls: string[] | null
  video_url: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  company: string | null
  subject: string
  phone: string | null
  email: string | null
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export type MonitoringData = {
  id: string
  source_id: string
  source_name: string
  value: number | null
  unit: string | null
  status: 'on' | 'off' | 'warn'
  metadata: Json
  recorded_at: string
}
