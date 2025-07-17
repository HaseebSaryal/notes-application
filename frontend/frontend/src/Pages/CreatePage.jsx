import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from  "../libs/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
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
  {/* Title Field */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
    <input
      type="text"
      placeholder="e.g. Meeting Notes"
      className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </div>

  {/* Content Field */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
    <textarea
      placeholder="Write your note here..."
      className="w-full px-4 py-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none min-h-[150px]"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  </div>

  {/* Submit Button */}
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