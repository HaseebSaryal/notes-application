import { useState } from "react";
import { PenSquareIcon, Trash2Icon, AlertTriangle, X } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../libs/utils";
import api from '../libs/axios'
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const wordCount = note.content?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <>
      <Link
        to={`/view/${note._id}`}
        className="card bg-base-100 border-t-4 border-solid border-[#00FF9D]
        transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="card-body">
          <h3 className="card-title text-base-content">{note.title}</h3>
          <p className="text-base-content/70 line-clamp-3">{note.content}</p>
          <div className="card-actions justify-between items-center mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-base-content/60">
                {formatDate(new Date(note.createdAt))}
              </span>
              <span className="text-xs text-base-content/40">
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center gap-1">
              <PenSquareIcon className="size-4" />
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={handleDeleteClick}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Custom Delete Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-base-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-error/10">
                  <AlertTriangle className="size-5 text-error" />
                </div>
                <h3 className="font-semibold text-base-content text-lg">Delete Note</h3>
              </div>
              <button
                className="btn btn-ghost btn-xs btn-circle"
                onClick={() => setShowConfirm(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Message */}
            <p className="text-base-content/60 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-base-content font-medium">"{note.title}"</span>?
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? <span className="loading loading-spinner loading-xs" /> : <Trash2Icon className="size-4" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;