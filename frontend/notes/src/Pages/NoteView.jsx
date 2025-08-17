import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { PenSquareIcon, Trash2Icon, LoaderCircleIcon, ArrowLeftIcon } from "lucide-react";
import api from "../libs/axios";
import { formatDate } from "../libs/utils";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`);
        setNote(data.note);
        setEditedTitle(data.note.title);
        setEditedContent(data.note.content);
      } catch (error) {
        console.error("Failed to fetch note", error);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note", error);
      toast.error("Failed to delete note");
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/notes/${id}`, {
        title: editedTitle,
        content: editedContent,
      });
      setNote(data.note);
      setEditMode(false);
      toast.success("Note updated");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update note");
    }
  };

if (!note) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-50"></div>
          </div>
        </div>
        <p className="text-primary text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-base-content">Note Details</h1>
        
        <div className="mb-4">
           <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
        </div>

        <div className="card bg-base-100 shadow-md transition-all duration-200 border-t-4 border-[#00FF9D] rounded-md">
          <div className="card-body">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="input text-xl font-bold input-bordered w-full mb-4 rounded-md"
                />
                <textarea
                  rows={10}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-md"
                />
                <button className="btn btn-success mt-4" onClick={handleUpdate}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <h3 className="card-title text-2xl text-base-content">{note.title}</h3>
                <p className="text-base-content/70 whitespace-pre-wrap leading-relaxed mt-2">
                  {note.content}
                </p>
              </>
            )}

            <div className="card-actions justify-between items-center mt-6">
              <span className="text-sm text-base-content/60">
                {formatDate(new Date(note.createdAt))}
              </span>

              <div className="flex items-center gap-3">
                <button
                  className="btn btn-ghost text-primary text-lg"
                  onClick={() => setEditMode((prev) => !prev)}
                  title="Edit Note"
                >
                  <PenSquareIcon className="w-6 h-6" />
                </button>
                <button
                  className="btn btn-ghost text-error text-lg"
                  onClick={handleDelete}
                  title="Delete Note"
                >
                  <Trash2Icon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;
