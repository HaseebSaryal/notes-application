import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PenSquareIcon,
  Trash2Icon,
  LoaderCircleIcon,
  ArrowLeftIcon,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../libs/axios";
import { formatDate } from "../libs/utils";
import AutocompleteTextarea from "../components/AutocompleteTextarea";

const AILoader = ({ text }) => (
  <div className="flex items-center gap-2">
    <span className="loading loading-spinner loading-xs"></span>
    <span className="text-xs sm:text-sm">{text}</span>
  </div>
);

const cleanAiText = (text = "") => {
  return text
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/^(here(?:'s| is)\s+)?(a\s+)?summary[:\-\s]*/i, "")
    .replace(/^(ai\s+)?summary[:\-\s]*/i, "")
    .replace(
      /^(here(?:'s| is)\s+)?(the\s+)?improved\s+(note|version|content)[:\-\s]*/i,
      ""
    )
    .replace(/^improved\s+(note|version|content)[:\-\s]*/i, "")
    .replace(/^i\s+(have|ve|'ve)?\s*(summarized|improved|rewritten).*?[:\-\s]*/i, "")
    .trim();
};

const NoteView = () => {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    summarize: false,
    improve: false,
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`);
        setNote(data.note);
        setEditedTitle(data.note.title);
        setEditedContent(data.note.content);
      } catch (error) {
        setError(error?.response?.data?.msg || "Failed to fetch note");
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      setDeleted(true);
      setNote(null);
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleUpdate = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const { data } = await api.put(`/notes/${id}`, {
        title: editedTitle,
        content: editedContent,
      });

      setNote(data.note);
      setEditMode(false);
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleSummarize = async () => {
    if (!editedContent.trim()) {
      toast.error("Add note content first");
      return;
    }

    setAiLoading((prev) => ({ ...prev, summarize: true }));
    setSummary("");

    try {
      const { data } = await api.post("/summarize", { text: editedContent });
      setSummary(cleanAiText(data.summary || ""));
      toast.success("Summary generated");
    } catch {
      toast.error("Failed to summarize note");
    } finally {
      setAiLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleImprove = async () => {
    if (!editedContent.trim()) {
      toast.error("Add note content first");
      return;
    }

    setAiLoading((prev) => ({ ...prev, improve: true }));

    try {
      const { data } = await api.post("/improve", { text: editedContent });
      const improvedText = cleanAiText(data.improvedText || "");

      setEditedContent(improvedText);
      setSummary("");
      toast.success("Note improved");
    } catch {
      toast.error("Failed to improve note");
    } finally {
      setAiLoading((prev) => ({ ...prev, improve: false }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!note) {
    if (deleted) {
      return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-3">Note deleted</h2>
            <p className="text-base-content/70 mb-6">
              The note was removed from your workspace.
            </p>
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-3">Note unavailable</h2>
            <p className="text-base-content/70 mb-6">{error}</p>
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <LoaderCircleIcon className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
          <Link to="/" className="btn btn-ghost btn-sm sm:btn-md">
            <ArrowLeftIcon className="size-5" />
            <span className="hidden sm:inline">Back to Notes</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold text-base-content">
            Note Details
          </h1>
        </div>

        <div className="card bg-base-100 shadow-md border-t-4 border-[#00FF9D] rounded-md">
          <div className="card-body p-4 sm:p-6 md:p-8">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="input input-bordered w-full mb-4 text-lg sm:text-xl font-bold rounded-md"
                />

                <AutocompleteTextarea
                  rows={10}
                  value={editedContent}
                  onChange={setEditedContent}
                  className="min-h-[220px]"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={handleSummarize}
                      disabled={aiLoading.summarize || aiLoading.improve}
                      type="button"
                    >
                      {aiLoading.summarize ? (
                        <AILoader text="Summarizing..." />
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          Summarize
                        </>
                      )}
                    </button>

                    <button
                      className="btn btn-sm btn-outline btn-accent"
                      onClick={handleImprove}
                      disabled={aiLoading.summarize || aiLoading.improve}
                      type="button"
                    >
                      {aiLoading.improve ? (
                        <AILoader text="Improving..." />
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          Improve
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    className="btn btn-sm btn-success self-end sm:self-auto"
                    onClick={handleUpdate}
                    type="button"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="card-title text-2xl sm:text-3xl text-base-content break-words">
                  {note.title}
                </h3>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-base-content/70 break-words">
                  {note.content}
                </p>
              </>
            )}

            {(aiLoading.summarize || aiLoading.improve) && (
              <div className="mt-6 rounded-lg border border-dashed border-base-300 bg-base-200/60 p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                  <span className="text-sm text-base-content/70">
                    {aiLoading.summarize ? "Summarizing..." : "Improving..."}
                  </span>
                </div>
              </div>
            )}

            {summary && !aiLoading.summarize && (
              <div className="mt-6 rounded-lg border border-dashed border-base-300 bg-base-200/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-base-content/70">
                    AI Summary
                  </p>

                  <button
                    onClick={handleCopy}
                    className="shrink-0 p-1.5 rounded hover:bg-base-300 transition-colors"
                    title="Copy summary"
                    type="button"
                  >
                    {copied ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4 text-base-content/50" />
                    )}
                  </button>
                </div>

                <p className="whitespace-pre-wrap text-base-content leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-base-300 flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-base-content/60">
                {formatDate(new Date(note.createdAt))}
              </span>

              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm sm:btn-md text-primary"
                  onClick={() => setEditMode((prev) => !prev)}
                  title="Edit Note"
                  type="button"
                >
                  <PenSquareIcon className="w-5 h-5" />
                </button>

                <button
                  className="btn btn-ghost btn-sm sm:btn-md text-error"
                  onClick={handleDelete}
                  title="Delete Note"
                  type="button"
                >
                  <Trash2Icon className="w-5 h-5" />
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