

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import ProblemTopBar from "../components/ProblemTopBar";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const editorWrapperRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");

  const [isFullscreen, setIsFullscreen] = useState(false);

  
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);

        const start =
          res.data.startCode.find(
            (sc) => sc.language === langMap[selectedLanguage],
          )?.initialCode || "";

        setProblem(res.data);
        setCode(start);
        setInitialCode(start);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  
  useEffect(() => {
    if (!problem) return;

    const start =
      problem.startCode.find((sc) => sc.language === langMap[selectedLanguage])
        ?.initialCode || "";

    setCode(start);
    setInitialCode(start);
  }, [selectedLanguage, problem]);

  
  const handleResetCode = () => {
    setCode(initialCode);
  };

 
  const toggleFullscreen = () => {
    const el = editorWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  
  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(res.data || []);
      setActiveRightTab("testcase");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmitCode = async () => {
    setLoading(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(res.data);
      setActiveRightTab("result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      
      <div className="w-1/2 flex flex-col border-r border-base-300">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {[
            "description",
            "editorial",
            "solutions",
            "submissions",
            "chatAI",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeLeftTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeLeftTab === "description" && problem && (
            <>
              <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>

              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                
                {problem?.difficulty && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
        ${
          problem.difficulty === "Easy"
            ? "bg-green-500/20 text-green-400"
            : problem.difficulty === "Medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
        }`}
                  >
                    {problem.difficulty}
                  </span>
                )}

               
                {problem?.tags &&
                  (Array.isArray(problem.tags)
                    ? problem.tags
                    : [problem.tags]
                  ).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <p className="whitespace-pre-wrap">{problem.description}</p>

              
              <div className="mt-8 space-y-5">
                {problem.visibleTestCases?.map((ex, index) => (
                  <div key={index} className="bg-[#020617] p-5 rounded-lg">
                    <h3 className="font-semibold text-xl mb-2">
                      Example: {index + 1}
                    </h3>
                    <div>
                      <b>Input:</b> {ex.input}
                    </div>
                    <div>
                      <b>Output:</b> {ex.output}
                    </div>
                    <div>
                      <b>Explanation:</b> {ex.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeLeftTab === "editorial" && <Editorial {...problem} />}
          {activeLeftTab === "solutions" && (
            <div className="space-y-6">
              {problem.referenceSolution?.map((sol, i) => (
                <div key={i} className="bg-base-200 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {problem.title} – {sol.language}
                  </h3>
                  <pre className="bg-base-300 p-4 rounded">
                    <code>{sol.completeCode}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
          {activeLeftTab === "submissions" && (
            <SubmissionHistory problemId={problemId} />
          )}
          {activeLeftTab === "chatAI" && <ChatAi problem={problem} />}
        </div>
      </div>

     
      <div className="w-1/2 flex flex-col relative" ref={editorWrapperRef}>
        
        <div className="absolute top-2 right-3 z-10 flex gap-3 mr-15 mt-10">
          <button
            title="Reset Code"
            onClick={handleResetCode}
            className="text-xl hover:text-warning"
          >
            ↺
          </button>
          <button
            title="Fullscreen"
            onClick={toggleFullscreen}
            className="text-xl hover:text-info"
          >
            ⛶
          </button>
        </div>

        <div className="tabs tabs-bordered bg-base-200 px-4">
          {["code", "testcase", "result"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeRightTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeRightTab === "code" && (
          <>
            <ProblemTopBar
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedLanguage}
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{ minimap: { enabled: false } }}
            />

            <div className="p-4 flex justify-end gap-2">
              <button className="btn btn-outline btn-sm" onClick={handleRun}>
                Run
              </button>
              <button
                className="btn bg-green-400 btn-sm  font-bold"
                onClick={handleSubmitCode}
              >
                Submit
              </button>
            </div>
          </>
        )}
        
        {activeRightTab === "testcase" && (
          <div className="p-5 space-y-4">
            {runResult?.map((tc, i) => {
              const passed = tc.status_id === 3;

              return (
                <div
                  key={i}
                  className={`rounded-lg border-l-4 p-4 shadow-sm transition-all mt-5
            ${
              passed
                ? "border-green-500 bg-green-500/10"
                : "border-red-500 bg-red-500/10"
            }
          `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Case {i + 1}</h3>

                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full
                ${passed ? "bg-green-600 text-white" : "bg-red-600 text-white"}
              `}
                    >
                      {passed ? "✓ Passed" : "✗ Failed"}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <div>
                      <b>Input:</b> {tc.stdin}
                    </div>
                    <div>
                      <b>Expected:</b> {tc.expected_output}
                    </div>
                    <div>
                      <b>Your Output:</b> {tc.stdout}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeRightTab === "result" && submitResult && (
          <div className="p-6">
            <div className="rounded-2xl bg-green-500 text-white p-6 shadow-lg mt-5">
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎉</span>
                <h2 className="text-2xl font-bold">Accepted</h2>
              </div>

              
              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <p className="text-lg font-semibold">
                  Test Cases Passed
                  <span className="ml-2 font-bold">
                    {submitResult.testCasesPassed}/{submitResult.testCasesTotal}
                  </span>
                </p>
              </div>

             
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-sm opacity-80">Runtime</p>
                  <p className="text-lg font-semibold">
                    {submitResult.runtime}s
                  </p>
                </div>

                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-sm opacity-80">Memory</p>
                  <p className="text-lg font-semibold">
                    {submitResult.memory} KB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
