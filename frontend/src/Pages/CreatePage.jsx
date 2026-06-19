import { ArrowLeftIcon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import api from "../libs/axios";
import AutocompleteTextarea from "../components/AutocompleteTextarea";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleSuggestion, setTitleSuggestion] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  // Title se content suggest karo
  useEffect(() => {
    if (!title.trim() || content.trim()) {
      setTitleSuggestion("");
      return;
    }

    const timeout = setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const { data } = await api.post("/autocomplete", {
          text: `I am writing a note titled "${title}". Suggest what the content should look like. Be concise and practical. Match the language of the title (Roman Urdu or English).`
        });
        setTitleSuggestion(data?.suggestion || "");
      } catch {
        setTitleSuggestion("");
      } finally {
        setSuggestionLoading(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [title]);

  const acceptTitleSuggestion = () => {
    setContent(titleSuggestion);
    setTitleSuggestion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully!");
      setTitle("");
      setContent("");
      setTitleSuggestion("");
    } catch (error) {
      console.log("Error creating note", error);
      const status = error?.response?.status;
      if (status === 429) {
        toast.error("Slow down! You're creating notes too fast", { duration: 4000, icon: "💀" });
      } else if (!error.response) {
        toast.error("Cannot reach the backend server");
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Meeting Notes"
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* AI Title Suggestion */}
                {title.trim() && !content.trim() && (
                  <div className="mb-4 px-3 py-2 border border-base-300 bg-base-200 rounded-md">
                    {suggestionLoading ? (
                      <p className="text-xs text-base-content/40 flex items-center gap-2">
                        <span className="loading loading-spinner loading-xs" />
                        AI soch raha hai...
                      </p>
                    ) : titleSuggestion ? (
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-base-content/50 flex-1 line-clamp-2">
                          {titleSuggestion}
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setTitleSuggestion("")}
                            className="text-xs text-base-content/40 hover:text-base-content/70 px-2 py-1"
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            onClick={acceptTitleSuggestion}
                            className="flex items-center gap-1 text-xs bg-primary text-primary-content px-3 py-1 rounded"
                          >
                            <Sparkles className="size-3" />
                            Use
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <AutocompleteTextarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={setContent}
                    rows={6}
                    className="min-h-37.5"
                  />
                </div>

                <div className="text-right">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;