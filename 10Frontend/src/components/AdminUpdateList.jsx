
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

const AdminUpdateList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data || []);
        setLoading(false);
      } catch (err) {
        alert("Failed to load problems");
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select Problem to Update</h1>

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
                <NavLink
                  to={`/admin/update/${problem._id}`}
                  className="btn btn-warning btn-sm"
                >
                  Update
                </NavLink>
              </td>
            </tr>
          ))}

          {problems.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-gray-500">
                No problems found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUpdateList;
