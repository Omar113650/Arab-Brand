import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  getProjectStatus,
  getProjectResult,
  deleteProject
} from "./project.controller";

const router = Router();

router.use(protect); // protect all project routes

router.post("/", createProject);
router.get("/",  getProjects);
router.get("/:id", getProjectStatus);
router.get("/:id/result", getProjectResult);
router.delete("/:id", deleteProject);

export default router;
