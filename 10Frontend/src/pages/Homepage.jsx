import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

const ITEMS_PER_PAGE = 5;

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    status: "all",
    difficulty: "all",
    tag: "all",
    favorite: false,
  });

  useEffect(() => {
    axiosClient.get("/problem/getAllProblem", {
  headers: { Authorization: `Bearer ${token}` }
})
.then((res) => {
      setProblems(res.data);
    });

    if (user) {
      axiosClient.get("/problem/problemSolvedByUser").then((res) => {
        setSolvedProblems(res.data);
      });

      axiosClient.get("/problem/favorites").then((res) => {
        setFavorites(res.data.map((p) => p._id));
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    setFavorites([]);
  };

  const toggleFavorite = async (problemId) => {
    const { data } = await axiosClient.post(`/problem/favorite/${problemId}`);
    setFavorites(data);
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const isSolved = solvedProblems.some((sp) => sp._id === p._id);
      const isFav = favorites.includes(p._id);

      if (filters.favorite && !isFav) return false;
      if (filters.status === "solved" && !isSolved) return false;
      if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty)
        return false;
      if (filters.tag !== "all" && p.tags !== filters.tag) return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.tags.toLowerCase().includes(q) ||
          p.difficulty.toLowerCase().includes(q) ||
          (q === "solved" && isSolved) ||
          (q === "favorite" && isFav)
        );
      }

      return true;
    });
  }, [problems, solvedProblems, favorites, filters, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow px-6">
        <div className="flex-1">
          <NavLink
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
          >
            LeetCode Master
          </NavLink>
        </div>

        {user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost normal-case text-base">
              {user.firstName}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              {user.role === "admin" && (
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search Problem here."
            className="input input-bordered w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select select-bordered"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
          </select>

          <select
            className="select select-bordered"
            onChange={(e) =>
              setFilters({
                ...filters,
                difficulty: e.target.value,
              })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>

          <button
            className={`btn ${
              filters.favorite ? "btn-warning" : "btn-outline"
            }`}
            onClick={() =>
              setFilters({
                ...filters,
                favorite: !filters.favorite,
              })
            }
          >
            Favorites
          </button>
        </div>

        <div className="space-y-5 mt-6">
          {paginatedProblems.map((problem) => {
            const isSolved = solvedProblems.some(
              (sp) => sp._id === problem._id,
            );
            const isFav = favorites.includes(problem._id);

            return (
              <div
                key={problem._id}
                className="bg-base-200 rounded-xl px-6 py-5 flex justify-between items-center shadow-md hover:bg-base-300 transition"
              >
                <NavLink to={`/problem/${problem._id}`} className="space-y-2">
                  <h2 className="text-lg font-semibold text-white">
                    {problem.title}
                  </h2>

                  <div className="flex gap-2">
                    <span
                      className={`badge ${
                        problem.difficulty === "easy"
                          ? "badge-success"
                          : problem.difficulty === "medium"
                            ? "badge-warning"
                            : "badge-error"
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    <span className="badge badge-info">{problem.tags}</span>
                  </div>
                </NavLink>

                <div className="flex items-center gap-4">
                  {isSolved && (
                    <span className="badge badge-success gap-1">✓ Solved</span>
                  )}

                  <button
                    onClick={() => toggleFavorite(problem._id)}
                    className={`text-2xl transition ${
                      isFav
                        ? "text-yellow-400"
                        : "text-gray-400 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1 ? "btn-success" : "btn-outline"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
