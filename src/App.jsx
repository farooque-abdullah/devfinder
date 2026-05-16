import { useState, useCallback } from "react";

const SAMPLE_USER = {
  login: "torvalds", name: "Linus Torvalds", avatar_url: "https://avatars.githubusercontent.com/u/1024025",
  bio: "Creator of Linux and Git.", location: "Portland, OR", company: "Linux Foundation",
  blog: "https://github.com/torvalds", public_repos: 8, followers: 218000, following: 0,
  created_at: "2011-09-04T22:37:31Z",
};
const SAMPLE_REPOS = [
  { id: 1, name: "linux", description: "Linux kernel source tree", stargazers_count: 180000, language: "C", forks_count: 56000, html_url: "#" },
  { id: 2, name: "subsurface-for-dirk", description: "a minor change attempt to code", stargazers_count: 210, language: "C++", forks_count: 75, html_url: "#" },
  { id: 3, name: "uemacs", description: "Random version of microemacs", stargazers_count: 612, language: "C", forks_count: 130, html_url: "#" },
  { id: 4, name: "test-tlb", description: "A simple rng test", stargazers_count: 452, language: "C", forks_count: 79, html_url: "#" },
];

const LANG_COLORS = { JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572A5", C: "#555555", "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", CSS: "#563d7c", HTML: "#e34c26", Dart: "#00B4AB" };

export default function DevFinder() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(SAMPLE_USER);
  const [repos, setRepos] = useState(SAMPLE_REPOS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(true);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true); setError(""); setUser(null); setRepos([]);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${query.trim()}`),
        fetch(`https://api.github.com/users/${query.trim()}/repos?sort=stars&per_page=6`),
      ]);
      if (!uRes.ok) throw new Error("User not found");
      const [u, r] = await Promise.all([uRes.json(), rRes.json()]);
      setUser(u); setRepos(r);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [query]);

  const bg = dark ? "#0d1117" : "#f6f8fa";
  const surface = dark ? "#161b22" : "#ffffff";
  const border = dark ? "#30363d" : "#d0d7de";
  const text = dark ? "#e6edf3" : "#24292f";
  const muted = dark ? "#8b949e" : "#57606a";
  const accent = "#2f81f7";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0" }}>
      {/* Header */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg height="28" viewBox="0 0 16 16" fill={text} aria-label="GitHub"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          <span style={{ fontWeight: 700, fontSize: 18 }}>DevFinder</span>
        </div>
        <button onClick={() => setDark(d => !d)} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 6, padding: "6px 14px", color: text, cursor: "pointer", fontSize: 13 }}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "0 14px", gap: 10 }}>
            <span style={{ color: muted, fontSize: 18 }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search GitHub username..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: text, fontFamily: "inherit", fontSize: 15, padding: "12px 0" }} />
          </div>
          <button onClick={search} style={{ background: accent, border: "none", borderRadius: 10, padding: "12px 22px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        {error && <div style={{ background: "#ff000020", border: "1px solid #ff000050", borderRadius: 8, padding: "12px 16px", color: "#f85149", marginBottom: 20 }}>⚠️ {error}</div>}

        {user && (
          <div>
            {/* User Card */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                <img src={user.avatar_url} alt={user.login} style={{ width: 90, height: 90, borderRadius: "50%", border: `3px solid ${border}` }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{user.name || user.login}</h2>
                    <a href={`https://github.com/${user.login}`} target="_blank" rel="noreferrer" style={{ color: accent, fontSize: 13, textDecoration: "none" }}>@{user.login} ↗</a>
                  </div>
                  {user.bio && <p style={{ color: muted, margin: "8px 0", fontSize: 14 }}>{user.bio}</p>}
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    {user.location && <span style={{ color: muted, fontSize: 13 }}>📍 {user.location}</span>}
                    {user.company && <span style={{ color: muted, fontSize: 13 }}>🏢 {user.company}</span>}
                    {user.blog && <a href={user.blog} style={{ color: accent, fontSize: 13 }}>🔗 Blog</a>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
                {[
                  { label: "Repos", value: user.public_repos?.toLocaleString() },
                  { label: "Followers", value: user.followers?.toLocaleString() },
                  { label: "Following", value: user.following?.toLocaleString() },
                ].map(stat => (
                  <div key={stat.label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repos */}
            {repos.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, color: muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Top Repositories</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                  {repos.slice(0, 6).map(repo => (
                    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: 16, height: "100%", transition: "border-color 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                        onMouseLeave={e => e.currentTarget.style.borderColor = border}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: accent, marginBottom: 6 }}>📁 {repo.name}</div>
                        <div style={{ fontSize: 13, color: muted, marginBottom: 12, minHeight: 36 }}>{repo.description || "No description"}</div>
                        <div style={{ display: "flex", gap: 14, fontSize: 12, color: muted }}>
                          {repo.language && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ width: 10, height: 10, borderRadius: "50%", background: LANG_COLORS[repo.language] || "#888", display: "inline-block" }} />
                              {repo.language}
                            </span>
                          )}
                          <span>⭐ {repo.stargazers_count?.toLocaleString()}</span>
                          <span>🍴 {repo.forks_count?.toLocaleString()}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
