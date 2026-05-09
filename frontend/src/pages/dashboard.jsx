import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    projectId: "",
    assignedToId: "",
  });

  const fetchData = async () => {
    try {
      const taskRes = await API.get("/tasks");
      const projectRes = await API.get("/projects");
      const userRes = await API.get("/auth/users");

      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (error) {
      alert("Please login first");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createProject = async () => {
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
    } catch (error) {
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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <button onClick={logout}>Logout</button>

      <h1>Team Task Manager Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px" }}>
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px" }}>
          <h3>Projects</h3>
          <h2>{projects.length}</h2>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px" }}>
          <h3>Overdue Tasks</h3>
          <h2>{overdueTasks.length}</h2>
        </div>
      </div>

      <hr />

      <h2>Create Project</h2>

      <input
        placeholder="Project name"
        value={projectForm.name}
        onChange={(e) =>
          setProjectForm({ ...projectForm, name: e.target.value })
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Project description"
        value={projectForm.description}
        onChange={(e) =>
          setProjectForm({ ...projectForm, description: e.target.value })
        }
      />

      <br />
      <br />

      <button onClick={createProject}>Create Project</button>

      <hr />

      <h2>Create Task</h2>

      <input
        placeholder="Task title"
        value={taskForm.title}
        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
      />

      <br />
      <br />

      <textarea
        placeholder="Task description"
        value={taskForm.description}
        onChange={(e) =>
          setTaskForm({ ...taskForm, description: e.target.value })
        }
      />

      <br />
      <br />

      <input
        type="date"
        value={taskForm.dueDate}
        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
      />

      <br />
      <br />

      <select
        value={taskForm.projectId}
        onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
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

      <br />
      <br />

      <button onClick={createTask}>Create Task</button>

      <hr />

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found yet.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Project: {task.project?.name}</p>
            <p>Assigned To: {task.assignedTo?.name}</p>

            <select
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;