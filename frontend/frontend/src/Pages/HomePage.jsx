import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import api from '../libs/axios'
import NoteCard from '../components/NoteCard'
import NotesNotFound from '../components/NotesNotFound'

const HomePage = () => {
const [notes, setNotes] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchNotes = async () => {
    try {
      setLoading(true);
      console.log("⏳ Fetching notes...");
      const res = await api.get('/notes');
      console.log("✅ API response:", res);

      // If your backend returns: { data: notes }
      setNotes(res.data?.data || []); 
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, []);



  return (
<div className='min-h-screen'>
  <Navbar />
  <div className='max-w-7xl mx-auto'>
    {loading ? (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-b-transparent border-l-gray-300 border-r-gray-500 animate-spin shadow-inner"></div>
          <p className="text-gray-400 text-lg font-medium">Loading notes...</p>

        </div>
      </div>
      
    ) :  (
      <div className='max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {notes.map(note => (
          <NoteCard key={note._id} note={note} setNotes={setNotes}/>
        ))}
      </div>
    )}
    {notes.length === 0 ? <NotesNotFound/> : null}
   
  </div>
</div>

  )
}

export default HomePage