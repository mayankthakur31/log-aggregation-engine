
import { useCallback, useEffect, useState } from "react"

const API_URL = "http://127.0.0.1:8000"

function App() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [page, setPage] = useState(0)
  const limit = 10

  const [stats, setStats] = useState({
    total_logs: 0,
    errors: 0,
    warnings: 0,
    critical: 0,
    info: 0,
  })

  const [service, setService] = useState("")
  const [level, setLevel] = useState("")
  const [environment, setEnvironment] = useState("")
  const [search, setSearch] = useState("")

  const fetchLogs = useCallback(() => {
    setLoading(true)
    setError("")

    const params = new URLSearchParams()
    params.append("limit", String(limit))
    params.append("offset", String(page * limit))

    if (service) params.append("service", service)
    if (level) params.append("level", level)
    if (environment) params.append("environment", environment)
    if (search.trim()) params.append("search", search.trim())

    return fetch(`${API_URL}/logs?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch logs")
        }
        return response.json()
      })
      .then((data) => {
        setLogs(data.logs)
      })
      .catch((err) => {
        setError(err.message)
        console.error("Failed to fetch logs:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, service, level, environment, search])

  const fetchStats = useCallback(() => {
    return fetch(`${API_URL}/stats`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch statistics")
        }
        return response.json()
      })
      .then((data) => {
        setStats(data)
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err)
      })
  }, [])

  // Fetch logs whenever the page or filters change.
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Load statistics when the dashboard opens.
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Automatically refresh logs and statistics every 10 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLogs()
      fetchStats()
    }, 10000)

    return () => clearInterval(intervalId)
  }, [fetchLogs, fetchStats])

  const applyFilters = () => {
    if (page !== 0) {
      setPage(0)
    } else {
      fetchLogs()
    }
  }

  const clearFilters = () => {
    setService("")
    setLevel("")
    setEnvironment("")
    setSearch("")
    setPage(0)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h1 className="text-2xl font-bold">Log Aggregator</h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-Time Monitoring
        </p>

        <nav className="mt-10 space-y-3">
          <button className="w-full rounded-lg bg-slate-800 px-4 py-3 text-left">
            Dashboard
          </button>
          <button
            onClick={() =>
              document.getElementById("logs-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800"
          >
            Logs
          </button>
          <button
            onClick={() =>
              document.getElementById("stats-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800"
          >
            Alerts & Stats
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-4 md:ml-64 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="mt-1 text-slate-400">
            Monitor your distributed services in real time.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Dashboard refreshes automatically every 10 seconds.
          </p>
        </div>

        {/* Statistics */}
        <div
          id="stats-section"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Logs</p>
            <h3 className="mt-2 text-3xl font-bold">
              {stats.total_logs}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Errors</p>
            <h3 className="mt-2 text-3xl font-bold text-red-400">
              {stats.errors}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Warnings</p>
            <h3 className="mt-2 text-3xl font-bold text-yellow-400">
              {stats.warnings}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Critical</p>
            <h3 className="mt-2 text-3xl font-bold text-red-500">
              {stats.critical}
            </h3>
          </div>
        </div>

        {/* Logs Section */}
        <section
          id="logs-section"
          className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
        >
          <div className="border-b border-slate-800 p-6">
            <h3 className="text-xl font-semibold">Recent Logs</h3>
            <p className="mt-1 text-sm text-slate-400">
              Latest activity from your services.
            </p>

            {/* Search and Filters */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <input
                type="text"
                placeholder="Search log messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters()
                }}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              >
                <option value="">All Services</option>
                <option value="payment-service">Payment Service</option>
                <option value="order-service">Order Service</option>
                <option value="auth-service">Auth Service</option>
                <option value="user-service">User Service</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              >
                <option value="">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              >
                <option value="">All Environments</option>
                <option value="development">Development</option>
                <option value="production">Production</option>
                <option value="testing">Testing</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
              >
                Apply Filters
              </button>

              <button
                onClick={clearFilters}
                className="rounded-lg border border-slate-700 px-5 py-3 hover:bg-slate-800"
              >
                Clear Filters
              </button>

              <button
                onClick={() => {
                  fetchLogs()
                  fetchStats()
                }}
                disabled={loading}
                className="rounded-lg border border-slate-700 px-5 py-3 hover:bg-slate-800 disabled:opacity-50"
              >
                Refresh Now
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-800 text-sm text-slate-400">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Environment</th>
                  <th className="px-6 py-4">Request ID</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      Loading logs...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-red-400"
                    >
                      {error}. Check that the backend is running.
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {log.service}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={
                            log.level === "CRITICAL" ||
                            log.level === "ERROR"
                              ? "font-semibold text-red-400"
                              : log.level === "WARNING"
                                ? "font-semibold text-yellow-400"
                                : "text-slate-300"
                          }
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="min-w-64 px-6 py-4">
                        {log.message}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {log.environment}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {log.request_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - below the table */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 p-6">
            <p className="text-sm text-slate-400">
              Page {page + 1} · Showing {logs.length} logs
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setPage((currentPage) => Math.max(0, currentPage - 1))
                }
                disabled={page === 0 || loading}
                className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={logs.length < limit || loading || Boolean(error)}
                className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
