// GithubDrawer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { X, Github } from "lucide-react";

/* ---------- Helper Icons ---------- */
const CommitIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-gray-400"
  >
    <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32Z"></path>
  </svg>
);

const RepoIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-gray-400"
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
  </svg>
);

/* ---------- Utilities for Heatmap ---------- */
const startOfWeekMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const dateKey = (d) => {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
};

const colorForCount = (count) => {
  if (!count || count === 0) return "#161b22";
  if (count <= 1) return "#9be9a8";
  if (count <= 3) return "#40c463";
  if (count <= 7) return "#30a14e";
  return "#216e39";
};

/* ---------- Heatmap Component ---------- */
function ContributionsHeatmap({ calendar, repositoryCount }) {
  const CELL = 12;
  const GAP = 4;

  const contributionsByDate = useMemo(() => {
    const map = {};
    if (!calendar?.weeks) return map;
    calendar.weeks.forEach((wk) => {
      wk.contributionDays.forEach((d) => {
        if (!d || !d.date) return;
        map[dateKey(d.date)] = {
          count: d.contributionCount || 0,
          color: d.color || colorForCount(d.contributionCount || 0),
        };
      });
    });
    return map;
  }, [calendar]);

  const { weeksGrid, monthLabels } = useMemo(() => {
    const resultWeeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 51 * 7);
    const startMonday = startOfWeekMonday(startDate);

    for (let w = 0; w < 52; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startMonday);
        cellDate.setDate(startMonday.getDate() + w * 7 + d);
        week.push(cellDate);
      }
      resultWeeks.push(week);
    }

    const monthPos = {};
    let prevMonth = null;
    resultWeeks.forEach((week, idx) => {
      const firstDay = week[0];
      const m = firstDay.getMonth();
      if (prevMonth === null) {
        monthPos[firstDay.toLocaleString("en-US", { month: "short" })] = idx;
        prevMonth = m;
        return;
      }
      if (m !== prevMonth) {
        monthPos[firstDay.toLocaleString("en-US", { month: "short" })] = idx;
        prevMonth = m;
      }
    });

    return { weeksGrid: resultWeeks, monthLabels: monthPos };
  }, [calendar]);

  const weekdayLabels = ["Mon", "Wed", "Fri"];

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <img
            src="/images/avatar.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
            style={{ objectPosition: "center 15%" }}
          />
          <div>
            <p className="text-white font-semibold text-lg">TungTXDev</p>
            <p className="text-gray-400 text-sm">Tạ Xuân Tùng</p>
          </div>
        </div>

        {/* GitHub link + Repo count */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm md:text-base">
            <a
              href="https://github.com/TungTXDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58a6ff] hover:underline font-semibold truncate"
            >
              https://github.com/TungTXDev
            </a>
          </div>

          <h4 className="text-white">{repositoryCount || 0} repositories</h4>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">
        Contribution Heatmap
      </h3>

      <div className="rounded-lg border border-gray-700 bg-[#161b22] p-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-gray-400">Total Contributions</span>
          <span className="text-xs text-gray-500">Last 12 months</span>
        </div>

        <p className="text-3xl font-bold text-white mb-4">
          {calendar?.totalContributions ?? 0}
        </p>

        <div className="relative overflow-x-auto pb-4 thin-scroll">
          <div className="relative h-4">
            {Object.entries(monthLabels).map(([month, weekIndex]) => (
              <div
                key={month}
                style={{ left: `${weekIndex * (CELL + GAP) + 48}px` }}
                className="absolute top-0 text-[11px] text-gray-400"
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex mt-2">
            <div className="flex flex-col justify-between mr-3 text-[10px] text-gray-400 h-[7 * (12 + 4)px]">
              {weekdayLabels.map((w) => (
                <div key={w} className="h-3 leading-3">
                  {w}
                </div>
              ))}
            </div>

            <div className="flex gap-[4px]">
              {weeksGrid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[4px]">
                  {week.map((d, di) => {
                    const key = dateKey(d);
                    const entry = contributionsByDate[key];
                    const count = entry?.count ?? 0;
                    const color = entry?.color ?? colorForCount(count);
                    const isFuture = d > new Date();

                    return (
                      <div
                        key={di}
                        title={`${d.toLocaleDateString()} — ${count} contribution${count !== 1 ? "s" : ""
                          }`}
                        className="rounded-sm"
                        style={{
                          width: `${CELL}px`,
                          height: `${CELL}px`,
                          backgroundColor: isFuture ? "transparent" : color,
                          borderRadius: 3,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Drawer Component ---------- */
const GithubDrawer = ({ isOpen, setIsOpen }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // States to control "Show more"
  const [showAllCommits, setShowAllCommits] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/api/github/contributions`);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !data) {
      fetchContributions();
    }
    // Reset "show more" states when drawer opens/closes
    if (!isOpen) {
      setShowAllCommits(false);
      setShowAllRepos(false);
    }
  }, [isOpen, data]);

  const getCurrentMonthYear = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const getMaxCommitCount = (repos) => {
    if (!repos || repos.length === 0) return 1;
    return Math.max(...repos.map((r) => r.contributions.totalCount));
  };

  // Helper variables for data slicing
  const commitList = data?.commitContributionsByRepository || [];
  const repoList = data?.repositoryContributions?.nodes || [];

  const visibleCommits = showAllCommits ? commitList : commitList.slice(0, 5);
  const visibleRepos = showAllRepos ? repoList : repoList.slice(0, 5);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-full md:w-1/2 bg-[#0d1117] text-[#c9d1d9] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-5 top-1/2 flex h-24 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-xl border-y border-r border-gray-700 bg-[#0d1117] text-gray-400 shadow-md hover:text-white"
        >
          <span className="text-xl font-bold ml-0.5">{isOpen ? "❮" : "❯"}</span>
        </button>

        <div className="h-full overflow-y-auto p-8 custom-scrollbar thin-scroll relative p-4 pr-5 pl-5 mt-10">
          <div className="flex justify-between items-center sticky top-0 bg-[#0d1117] z-10 py-2 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm md:text-base">
                GitHub Stats
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-gray-800/50 transition-colors flex items-center justify-center shadow-sm border border-gray-600"
              title="Đóng drawer"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {loading && (
            <div className="text-gray-400 animate-pulse">Loading...</div>
          )}

          {data && (
            <div className="space-y-8">
              {/* Heatmap */}
              <ContributionsHeatmap
                calendar={data.contributionCalendar}
                repositoryCount={data.repositoryContributions?.nodes?.length}
              />

              {/* Contribution activity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Contribution activity
                </h3>

                <div className="relative pl-4 border-l-2 border-gray-700 pb-8 mb-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#2a2f38] border-2 border-gray-700"></div>
                  <span className="text-xs font-semibold uppercase text-gray-400">
                    {getCurrentMonthYear()}
                  </span>
                </div>

                {/* Commits */}
                {commitList.length > 0 && (
                  <div className="relative pl-8 border-l-2 border-gray-700 pb-8">
                    <div className="absolute -left-4 top-0 p-1.5 bg-[#161b22] rounded-full border border-gray-700">
                      <CommitIcon />
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white">
                        Created{" "}
                        {commitList.reduce(
                          (acc, curr) => acc + curr.contributions.totalCount,
                          0
                        )}{" "}
                        commits in {commitList.length} repositories
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      {visibleCommits.map((repo, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between text-sm group"
                        >
                          <a
                            href={repo.repository.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#58a6ff] hover:underline font-medium truncate w-1/2"
                          >
                            {repo.repository.name}
                          </a>
                          <div className="flex items-center gap-3 w-1/2 justify-end">
                            <span className="text-xs text-gray-400 mr-2 group-hover:text-[#58a6ff]">
                              {repo.contributions.totalCount} commits
                            </span>
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full"
                                style={{
                                  width: `${(repo.contributions.totalCount /
                                    getMaxCommitCount(commitList)) *
                                    100
                                    }%`,
                                  background: "#3fb950",
                                }}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Show More / Show Less Button for Commits */}
                    {commitList.length > 5 && (
                      <div className="w-full flex justify-end">
                        <button
                          onClick={() => setShowAllCommits(!showAllCommits)}
                          className="mt-2 text-xs text-[#58a6ff] hover:underline font-medium focus:outline-none"
                        >
                          {showAllCommits
                            ? "Show less"
                            : `Show ${commitList.length - 5} more...`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Repositories */}
                {repoList.length > 0 && (
                  <div className="relative pl-8 border-l-2 border-gray-700 pb-4">
                    <div className="absolute -left-4 top-0 p-1.5 bg-[#161b22] rounded-full border border-gray-700">
                      <RepoIcon />
                    </div>

                    <h4 className="text-white mb-3">
                      Created {repoList.length} repositories
                    </h4>

                    <ul className="space-y-3">
                      {visibleRepos.map((node, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 16 16"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="text-gray-400 w-4 h-4"
                            >
                              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                            </svg>
                            <a
                              href={node.repository.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#58a6ff] hover:underline font-medium"
                            >
                              {node.repository.name}
                            </a>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            {node.repository.primaryLanguage && (
                              <div className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full border border-gray-800"
                                  style={{
                                    backgroundColor:
                                      node.repository.primaryLanguage.color,
                                  }}
                                ></span>
                                {node.repository.primaryLanguage.name}
                              </div>
                            )}
                            <span>
                              {new Date(
                                node.repository.createdAt
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Show More / Show Less Button for Repos */}
                    {repoList.length > 5 && (
                      <div className="w-full flex justify-end">
                        <button
                          onClick={() => setShowAllRepos(!showAllRepos)}
                          className="mt-2 text-xs text-[#58a6ff] hover:underline font-medium focus:outline-none"
                        >
                          {showAllRepos
                            ? "Show less"
                            : `Show ${repoList.length - 5} more...`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <a
                  href="https://github.com/TungTXDev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="w-full py-1.5 mt-2 text-xs font-semibold text-[#58a6ff] border border-gray-700 rounded-md hover:bg-[#161b22] transition-colors">
                    View full information on GitHub
                  </button>
                </a>
              </div>
            </div>
          )}

          {!loading && !data && (
            <div className="text-gray-400">
              Open drawer to load GitHub contributions.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GithubDrawer;
