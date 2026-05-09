const prisma = require("../utils/prisma");

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const { title, description, dueDate, assignedToId, projectId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        assignedToId: Number(assignedToId),
        projectId: Number(projectId),
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await prisma.task.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status,
      },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};