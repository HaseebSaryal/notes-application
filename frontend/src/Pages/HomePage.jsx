import React, { useEffect, useState } from 'react'
import api from '../libs/axios'
import NoteCard from '../components/NoteCard'
import NotesNotFound from '../components/NotesNotFound'
import { Search, FileText, CalendarDays, Clock } from 'lucide-react'
import useAuthSession from '../libs/useAuthSession'

const HomePage = () => {
  const [sort, setSort] = useState('newest');
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { token } = useAuthSession()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/notes');
        setNotes(res.data?.data || []); 
      } catch (error) {
        console.error("❌ Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sort === 'az') return a.title.localeCompare(b.title)
  })

  const totalNotes = notes.length
  const today = new Date()
  const thisWeekNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt)
    const diffDays = (today - noteDate) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }).length

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto'>

        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-50"></div>
                </div>
              </div>
              <p className="text-primary text-lg font-semibold">Loading notes...</p>
            </div>
          </div>
        ) : (
          <div className='max-w-6xl mx-auto px-4 py-8'>

            {/* Stats Bar */}
            <div className='flex flex-wrap gap-4 sm:gap-6 mb-6 text-sm text-gray-400'>
              <span className='flex items-center gap-2'>
                <FileText size={16} className='text-primary' />
                <strong className='text-white'>{totalNotes}</strong> Total Notes
              </span>
              <span className='flex items-center gap-2'>
                <Clock size={16} className='text-primary' />
                <strong className='text-white'>{thisWeekNotes}</strong> This Week
              </span>
              <span className='flex items-center gap-2'>
                <CalendarDays size={16} className='text-primary' />
                <strong className='text-white'>
                  {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </strong>
              </span>
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-2 mb-6">
              {['newest', 'oldest', 'az'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSort(option)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    sort === option
                      ? 'bg-primary text-primary-content border-primary'
                      : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {option === 'newest' ? 'Newest' : option === 'oldest' ? 'Oldest' : 'A–Z'}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className='mb-6 relative'>
              <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' />
              <input
                type='text'
                placeholder='Search notes...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-base-200 text-base-content border border-base-300 focus:outline-none focus:border-primary transition-colors'
              />
            </div>

            {/* Notes Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {sortedNotes.map(note => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>

            {/* No search results */}
            {filteredNotes.length === 0 && search && (
              <div className='text-center text-gray-400 mt-10'>
                <Search size={40} className='mx-auto mb-3 opacity-40' />
                <p className='text-lg'>No notes found for "<strong>{search}</strong>"</p>
              </div>
            )}

          </div>
        )}

        {!loading && notes.length === 0 ? <NotesNotFound /> : null}

      </div>
    </div>
  )
}

export default HomePage