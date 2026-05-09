const prisma = require("../utils/prisma");

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can create project" });
    }

    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};