

import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data || []);
    };
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;

    await axiosClient.delete(`/problem/delete/${id}`);
    setProblems((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Problems</h1>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id}>
              <td>{problem.title}</td>
              <td className="capitalize">{problem.difficulty}</td>
              <td>
               
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(problem._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDelete;

