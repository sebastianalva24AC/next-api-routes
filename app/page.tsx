'use client'

import { useState, useEffect } from 'react'
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

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [bio, setBio] = useState('')
  const [message, setMessage] = useState('')

  const fetchAuthors = async () => {
    const res = await fetch('/api/authors')
    const data = await res.json()
    setAuthors(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  const createAuthor = async () => {
    const res = await fetch('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, nationality, birthYear: parseInt(birthYear), bio }),
    })
    if (res.ok) {
      setMessage('Autor creado correctamente')
      setName(''); setEmail(''); setNationality(''); setBirthYear(''); setBio('')
      fetchAuthors()
    }
  }

  const deleteAuthor = async (id: string) => {
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    fetchAuthors()
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">📚 Sistema de Biblioteca</h1>

      <section className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Autor</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Nacionalidad" value={nationality} onChange={e => setNationality(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Año de nacimiento" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
          <textarea className="border p-2 rounded col-span-2" placeholder="Biografía" value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        <button onClick={createAuthor} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Crear Autor
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Lista de Autores</h2>
        {loading ? <p>Cargando...</p> : (
          <div className="grid gap-4">
            {authors.map(author => (
              <div key={author.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{author.name}</h3>
                  <p className="text-gray-600">{author.nationality} · {author.birthYear}</p>
                  <p className="text-gray-500 text-sm">{author.books?.length || 0} libros</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/authors/${author.id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Ver
                  </Link>
                  <button onClick={() => deleteAuthor(author.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <Link href="/books" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
            Ver Búsqueda de Libros
          </Link>
        </div>
      </section>
    </main>
  )
}