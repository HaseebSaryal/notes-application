import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../libs/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, Sparkles, Copy, Check } from "lucide-react";

const NoteDetails = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data.note);
      } catch (error) {
        const message = error?.response?.data?.msg || "Failed to fetch the note";
        setError(message);
        toast.error(message);
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
      setDeleted(true);
      setNote(null);
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!note.content.trim()) return toast.error("Note is empty!");
    setSummarizing(true);
    setSummary("");
    try {
      const res = await api.post("/api/summarize", { text: note.content });
      setSummary(res.data.summary || res.data.result || "");
    } catch {
      toast.error("Failed to summarize");
    } finally {
      setSummarizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-xl border border-base-300 bg-base-100 p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-3">{deleted ? "Note deleted" : "Note unavailable"}</h2>
          <p className="text-base-content/70 mb-6">{deleted ? "This note is no longer available." : error || "This note could not be loaded."}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-base-100 shadow-xl rounded-xl p-8 border border-base-300">

        {/* Header */}
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

        {/* Title */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base font-semibold">Title</span>
          </label>
          <input
            type="text"
            placeholder="Note title"
            className="input input-bordered w-full"
            value={note.title || ""}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
        </div>

        {/* Content */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base font-semibold">Content</span>
          </label>
          <textarea
            placeholder="Write your note here..."
            className="textarea textarea-bordered h-40 w-full"
            value={note.content || ""}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
          />
        </div>

        {/* Summarize Button */}
        <div className="mb-6">
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            {summarizing
              ? <LoaderIcon className="h-4 w-4 animate-spin" />
              : <Sparkles className="h-4 w-4" />
            }
            {summarizing ? "Summarizing..." : "Summarize with AI"}
          </button>

          {/* Summary Result */}
          {summary && (
            <div className="mt-3 p-3 rounded-lg bg-base-200 border border-base-300">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-base-content/70 leading-relaxed flex-1">
                  {summary}
                </p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-1.5 rounded hover:bg-base-300 transition-colors"
                  title="Copy summary"
                >
                  {copied
                    ? <Check className="size-4 text-success" />
                    : <Copy className="size-4 text-base-content/50" />
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-center">
          <button className="btn btn-primary w-40" disabled={saving} onClick={handleSave}>
            {saving ? (
              <span className="flex items-center gap-2">
                <LoaderIcon className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteDetails;