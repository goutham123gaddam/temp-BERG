import { serviceManager } from "../services/serviceManager.js";

export const createProject = async (req, res) => {
  try {
    const newProject = await serviceManager
      .getProjectService()
      .createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await serviceManager.getProjectService().getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await serviceManager
      .getProjectService()
      .getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updated = await serviceManager
      .getProjectService()
      .updateProject(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await serviceManager.getProjectService().deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
