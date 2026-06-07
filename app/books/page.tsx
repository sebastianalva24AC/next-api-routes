'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  description: string
  genre: string
  pages: number
  publishedYear: number
  author: { id: string; name: string }
}

interface Author {
  id: string
  name: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isbn, setIsbn] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [bookGenre, setBookGenre] = useState('')
  const [pages, setPages] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [message, setMessage] = useState('')

  const fetchAuthors = async () => {
    const res = await fetch('/api/authors')
    const data = await res.json()
    setAuthors(data)
  }

  const fetchBooks = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (genre) params.set('genre', genre)
    if (authorFilter) params.set('authorName', authorFilter)
    params.set('sortBy', sortBy)
    params.set('order', order)
    params.set('page', page.toString())
    params.set('limit', '10')

    const res = await fetch(`/api/books/search?${params.toString()}`)
    const data = await res.json()
    setBooks(data.data || [])
    setPagination(data.pagination)
    setLoading(false)
  }

  useEffect(() => {
    fetchAuthors()
    fetchBooks()
  }, [page, sortBy, order])

  const createBook = async () => {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, isbn,
        publishedYear: parseInt(publishedYear),
        genre: bookGenre,
        pages: parseInt(pages),
        authorId
      }),
    })
    if (res.ok) {
      setMessage('Libro creado correctamente')
      setTitle(''); setDescription(''); setIsbn(''); setPublishedYear('')
      setBookGenre(''); setPages(''); setAuthorId('')
      fetchBooks()
    }
  }

  const deleteBook = async (id: string) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    fetchBooks()
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📖 Búsqueda de Libros</h1>
        <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          ← Volver
        </Link>
      </div>

      <section className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Libro</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="border p-2 rounded" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Año de publicación" value={publishedYear} onChange={e => setPublishedYear(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Género" value={bookGenre} onChange={e => setBookGenre(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Páginas" value={pages} onChange={e => setPages(e.target.value)} />
          <select className="border p-2 rounded" value={authorId} onChange={e => setAuthorId(e.target.value)}>
            <option value="">Seleccionar autor</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <textarea className="border p-2 rounded col-span-2" placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button onClick={createBook} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Crear Libro
        </button>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Filtros de búsqueda</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Buscar por título..." value={search} onChange={e => setSearch(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Filtrar por género..." value={genre} onChange={e => setGenre(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Buscar por autor..." value={authorFilter} onChange={e => setAuthorFilter(e.target.value)} />
          <select className="border p-2 rounded" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="createdAt">Fecha de creación</option>
            <option value="title">Título</option>
            <option value="publishedYear">Año de publicación</option>
          </select>
          <select className="border p-2 rounded" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
          <button onClick={fetchBooks} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buscar
          </button>
        </div>
      </section>

      {loading ? <p>Cargando...</p> : (
        <>
          {pagination && <p className="text-gray-600 mb-4">Total: {pagination.total} resultados</p>}
          <div className="grid gap-4">
            {books.map(book => (
              <div key={book.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-gray-600">{book.genre} · {book.publishedYear} · {book.pages} páginas</p>
                  <p className="text-gray-500 text-sm">Autor: {book.author?.name}</p>
                </div>
                <button onClick={() => deleteBook(book.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          {pagination && (
            <div className="flex gap-4 mt-6 justify-center">
              <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">
                ← Anterior
              </button>
              <span className="py-2">Página {pagination.page} de {pagination.totalPages}</span>
              <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}