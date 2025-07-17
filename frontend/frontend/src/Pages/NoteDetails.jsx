import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../libs/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetails = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-base-100 shadow-xl rounded-xl p-8 border border-base-300">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="btn btn-sm btn-outline flex items-center gap-2">
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </Link>
          <button onClick={handleDelete} className="btn btn-sm btn-outline btn-error flex items-center gap-2">
            <Trash2Icon className="h-5 w-5" />
            Delete
          </button>
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base font-semibold">Title</span>
          </label>
          <input
            type="text"
            placeholder="Note title"
            className="input input-bordered w-full"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base font-semibold">Content</span>
          </label>
          <textarea
            placeholder="Write your note here..."
            className="textarea textarea-bordered h-40 w-full"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
          />
        </div>

        <div className="flex justify-center">
          <button className="btn btn-primary w-40" disabled={saving} onClick={handleSave}>
            {saving ? (
              <span className="flex items-center gap-2">
                <LoaderIcon className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
