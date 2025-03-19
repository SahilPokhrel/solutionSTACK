import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFire, FaComment, FaCheckCircle, FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [solutionText, setSolutionText] = useState({});
  const [editingProblem, setEditingProblem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const [problemDetails, setProblemDetails] = useState({
    title: "",
    description: "",
    tags: "",
    difficulty: "Medium",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/problems");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setProblemDetails({ ...problemDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemDetails.title || !problemDetails.description) return;

    const newProblem = {
      title: problemDetails.title,
      description: problemDetails.description,
      tags: problemDetails.tags.split(",").map((tag) => tag.trim()),
      difficulty: problemDetails.difficulty,
    };

    try {
      const response = await fetch(
        editingProblem
          ? `http://localhost:5000/api/problems/${editingProblem._id}`
          : "http://localhost:5000/api/problems",
        {
          method: editingProblem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProblem),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProblems(editingProblem ? problems.map(p => p._id === data._id ? data : p) : [data, ...problems]);
        setEditingProblem(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error posting problem:", error);
    }

    setProblemDetails({ title: "", description: "", tags: "", difficulty: "Medium" });
  };

  const handleComment = async (id) => {
    if (!commentText[id]?.trim()) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Anonymous", text: commentText[id] }),
      });
  
      const updatedProblem = await response.json();
      setProblems(problems.map(problem => problem._id === id ? updatedProblem : problem));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  
    setCommentText({ ...commentText, [id]: "" });
  };
  
  const handleSolution = async (id) => {
    if (!solutionText[id]?.trim()) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Anonymous", text: solutionText[id] }),
      });
  
      const updatedProblem = await response.json();
      setProblems(problems.map(problem => problem._id === id ? updatedProblem : problem));
    } catch (error) {
      console.error("Error adding solution:", error);
    }
  
    setSolutionText({ ...solutionText, [id]: "" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/problems/${id}`, { method: "DELETE" });
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Newest Problems</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Post a Problem
          </button>
        </div>

        <div className="space-y-4">
          {problems.map((problem) => (
            <div key={problem._id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{problem.title}</h2>

                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === problem._id ? null : problem._id)}>
                    <BsThreeDotsVertical className="text-gray-400" />
                  </button>
                  {menuOpen === problem._id && (
                    <div className="absolute right-0 bg-gray-700 p-2 rounded shadow-lg">
                      <button
                        className="flex items-center space-x-2 text-sm text-blue-400"
                        onClick={() => setEditingProblem(problem)}
                      >
                        <FaEdit /> <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center space-x-2 text-sm text-red-400 mt-2"
                        onClick={() => handleDelete(problem._id)}
                      >
                        <FaTrash /> <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-400">{problem.description}</p>

              <div className="flex gap-4 mt-3">
                <button className="text-orange-400">
                  <FaFire /> {problem.reactions?.fire || 0}
                </button>
                <button className="text-green-400">
                  <FaCheckCircle /> {problem.reactions?.check || 0}
                </button>
                <button className="text-blue-400">
                  <FaComment /> Comment
                </button>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold">Comments</h3>
                {problem.comments?.map((comment, index) => (
                  <p key={index} className="text-gray-300">
                    <span className="text-blue-300">{comment.username}:</span> {comment.text}
                  </p>
                ))}
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full p-2 bg-gray-700 rounded"
                    value={commentText[problem._id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [problem._id]: e.target.value })}
                  />
                  <button onClick={() => handleComment(problem._id)} className="text-blue-400">
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
