'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Author {
  id: string
  name: string
  email: string
  bio: string
  nationality: string
  birthYear: number
  books: any[]
}

interface Stats {
  authorId: string
  authorName: string
  totalBooks: number
  firstBook: { title: string; year: number } | null
  latestBook: { title: string; year: number } | null
  averagePages: number
  genres: string[]
  longestBook: { title: string; pages: number } | null
  shortestBook: { title: string; pages: number } | null
}

export default function AuthorPage() {
  const { id } = useParams()
  const [author, setAuthor] = useState<Author | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [nationality, setNationality] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [message, setMessage] = useState('')

  const fetchAuthor = async () => {
    const res = await fetch(`/api/authors/${id}`)
    const data = await res.json()
    setAuthor(data)
    setName(data.name)
    setEmail(data.email || '')
    setBio(data.bio || '')
    setNationality(data.nationality || '')
    setBirthYear(data.birthYear?.toString() || '')
    setLoading(false)
  }

  const fetchStats = async () => {
    const res = await fetch(`/api/authors/${id}/stats`)
    const data = await res.json()
    setStats(data)
  }

  useEffect(() => {
    fetchAuthor()
    fetchStats()
  }, [id])

  const updateAuthor = async () => {
    const res = await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, bio, nationality, birthYear: parseInt(birthYear) }),
    })
    if (res.ok) {
      setMessage('Autor actualizado correctamente')
      setEditing(false)
      fetchAuthor()
    }
  }

  if (loading) return <p className="p-8">Cargando...</p>
  if (!author) return <p className="p-8">Autor no encontrado</p>

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">👤 {author.name}</h1>
        <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          ← Volver
        </Link>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <section className="bg-gray-100 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Información del Autor</h2>
          <button onClick={() => setEditing(!editing)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Nacionalidad" value={nationality} onChange={e => setNationality(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Año de nacimiento" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
            <textarea className="border p-2 rounded col-span-2" placeholder="Biografía" value={bio} onChange={e => setBio(e.target.value)} />
            <button onClick={updateAuthor} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 col-span-2">
              Guardar cambios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <p><span className="font-semibold">Email:</span> {author.email}</p>
            <p><span className="font-semibold">Nacionalidad:</span> {author.nationality}</p>
            <p><span className="font-semibold">Año de nacimiento:</span> {author.birthYear}</p>
            <p className="col-span-2"><span className="font-semibold">Bio:</span> {author.bio}</p>
          </div>
        )}
      </section>

      {stats && (
        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded">
              <p className="text-gray-500 text-sm">Total de libros</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-gray-500 text-sm">Promedio de páginas</p>
              <p className="text-2xl font-bold">{stats.averagePages}</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-gray-500 text-sm">Primer libro</p>
              <p className="font-semibold">{stats.firstBook?.title} ({stats.firstBook?.year})</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-gray-500 text-sm">Último libro</p>
              <p className="font-semibold">{stats.latestBook?.title} ({stats.latestBook?.year})</p>
            </div>
            <div className="bg-white p-4 rounded col-span-2">
              <p className="text-gray-500 text-sm">Géneros</p>
              <p className="font-semibold">{stats.genres.join(', ') || 'Sin géneros'}</p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">📚 Libros del Autor</h2>
        {author.books?.length === 0 ? (
          <p className="text-gray-500">No hay libros registrados</p>
        ) : (
          <div className="grid gap-4">
            {author.books?.map((book: any) => (
              <div key={book.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-gray-600">{book.genre} · {book.publishedYear} · {book.pages} páginas</p>
                <p className="text-gray-500 text-sm">{book.description}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <Link href="/books" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
            Agregar nuevo libro
          </Link>
        </div>
      </section>
    </main>
  )
}