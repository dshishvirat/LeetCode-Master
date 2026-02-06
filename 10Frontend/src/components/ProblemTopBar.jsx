import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../authSlice";

const ProblemTopBar = ({ selectedLanguage, onLanguageChange }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const getLabel = (lang) => {
    if (lang === "cpp") return "C++";
    if (lang === "java") return "Java";
    return "JavaScript";
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 bg-base-200">

      
      <div className="dropdown">
        <label
          tabIndex={0}
          className="btn btn-sm btn-outline flex items-center gap-2"
        >
          {getLabel(selectedLanguage)}
          <span>⌄</span>
        </label>

        <div
          tabIndex={0}
          className="dropdown-content mt-2 p-3 bg-base-100 rounded-lg shadow w-44 space-y-2"
        >
          {["javascript", "java", "cpp"].map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="language"
                value={lang}
                checked={selectedLanguage === lang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="radio radio-sm radio-primary"
              />
              <span className="text-sm font-medium">
                {getLabel(lang)}
              </span>
            </label>
          ))}
        </div>
      </div>

      
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn btn-circle btn-sm bg-primary text-white"
        >
          {user?.firstName?.charAt(0).toUpperCase()}
        </label>

        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-40"
        >
          <li>
            <button onClick={() => navigate("/")}>Problems</button>
          </li>
          <li className="text-error">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default ProblemTopBar;
