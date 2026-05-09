import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [projectForm, setProjectForm] = useState({ name: "", description: "" });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    projectId: "",
    assignedToId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taskRes, projectRes, userRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/auth/users"),
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch {
      alert("Please login first");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createProject = async () => {
    if (!projectForm.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await API.post("/projects", projectForm);
      alert("Project created");
      setProjectForm({ name: "", description: "" });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Project creation failed");
    }
  };

  const createTask = async () => {
    if (
      !taskForm.title ||
      !taskForm.description ||
      !taskForm.dueDate ||
      !taskForm.projectId ||
      !taskForm.assignedToId
    ) {
      alert("Please fill all task fields");
      return;
    }

    try {
      await API.post("/tasks", taskForm);
      alert("Task created");
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        projectId: "",
        assignedToId: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Task creation failed");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch {
      alert("Status update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const overdueTasks = tasks.filter(
    (task) => new Date(task.dueDate) < new Date() && task.status !== "DONE"
  );

  const completedTasks = tasks.filter((task) => task.status === "DONE");

  const getBadgeStyle = (status) => {
    if (status === "DONE") return { ...styles.badge, ...styles.doneBadge };
    if (status === "IN_PROGRESS") return { ...styles.badge, ...styles.progressBadge };
    return { ...styles.badge, ...styles.todoBadge };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Team Task Manager</h1>
          <p style={styles.subtitle}>Manage projects, tasks, assignments, and progress</p>
        </div>
        <button style={styles.logoutButton} onClick={logout}>Logout</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Tasks</p>
          <h2 style={styles.statValue}>{tasks.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Projects</p>
          <h2 style={styles.statValue}>{projects.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Completed</p>
          <h2 style={styles.statValue}>{completedTasks.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Overdue</p>
          <h2 style={{ ...styles.statValue, color: "#dc2626" }}>{overdueTasks.length}</h2>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Create Project</h2>

          <input
            style={styles.input}
            placeholder="Project name"
            value={projectForm.name}
            onChange={(e) =>
              setProjectForm({ ...projectForm, name: e.target.value })
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Project description"
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm({ ...projectForm, description: e.target.value })
            }
          />

          <button style={styles.primaryButton} onClick={createProject}>
            Create Project
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Create Task</h2>

          <input
            style={styles.input}
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />

          <textarea
            style={styles.textarea}
            placeholder="Task description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <select
            style={styles.input}
            value={taskForm.projectId}
            onChange={(e) =>
              setTaskForm({ ...taskForm, projectId: e.target.value })
            }
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={taskForm.assignedToId}
            onChange={(e) =>
              setTaskForm({ ...taskForm, assignedToId: e.target.value })
            }
          >
            <option value="">Assign To</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          <button style={styles.primaryButton} onClick={createTask}>
            Create Task
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Tasks</h2>

        {loading ? (
          <p style={styles.emptyText}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3>No tasks yet</h3>
            <p>Create a project and assign your first task to get started.</p>
          </div>
        ) : (
          <div style={styles.taskGrid}>
            {tasks.map((task) => {
              const isOverdue =
                new Date(task.dueDate) < new Date() && task.status !== "DONE";

              return (
                <div
                  key={task.id}
                  style={{
                    ...styles.taskCard,
                    borderColor: isOverdue ? "#fecaca" : "#e2e8f0",
                  }}
                >
                  <div style={styles.taskTop}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <span style={getBadgeStyle(task.status)}>{task.status}</span>
                  </div>

                  <p style={styles.taskDescription}>{task.description}</p>

                  <p style={styles.taskMeta}>Project: {task.project?.name}</p>
                  <p style={styles.taskMeta}>Assigned: {task.assignedTo?.name}</p>
                  <p style={styles.taskMeta}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>

                  {isOverdue && <p style={styles.overdueText}>Overdue task</p>}

                  <select
                    style={styles.input}
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "34px",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "6px",
  },
  logoutButton: {
    padding: "11px 18px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  statLabel: {
    color: "#64748b",
    margin: 0,
  },
  statValue: {
    fontSize: "34px",
    margin: "8px 0 0",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
    marginBottom: "24px",
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  sectionTitle: {
    marginTop: 0,
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    minHeight: "85px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
  primaryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  taskCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px",
    background: "#f8fafc",
  },
  taskTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  taskTitle: {
    margin: 0,
  },
  badge: {
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    height: "fit-content",
    fontWeight: "bold",
  },
  todoBadge: {
    background: "#fef3c7",
    color: "#92400e",
  },
  progressBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  doneBadge: {
    background: "#dcfce7",
    color: "#166534",
  },
  taskDescription: {
    color: "#475569",
  },
  taskMeta: {
    color: "#64748b",
    fontSize: "14px",
  },
  emptyText: {
    color: "#64748b",
  },
  emptyBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "28px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
  },
  overdueText: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Dashboard;