import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  getProjectStatus,
  getProjectResult,
  deleteProject,
  generateExtraSocial,
  // generateLaunchPlanEndpoint,
  // generateAdScriptsEndpoint,
  // generateBuyerPersonaEndpoint
  // generateEmailCampaignEndpoint
} from "./project.controller";

const router = Router();

// router.use(protect); 

router.post("/", createProject);
router.get("/",  getProjects);
router.get("/:id", getProjectStatus);
router.get("/:id/result", getProjectResult);
router.delete("/:id", deleteProject);

// out of scope

// router.post("/:id/social/generate",        generateExtraSocial);
// router.post("/:id/generate/launch-plan",   generateLaunchPlanEndpoint);
// router.post("/:id/generate/buyer-persona", generateBuyerPersonئaEndpoint);
// router.post("/:id/generate/ad-scripts",    generateAdScriptsEndpoint);
// router.post("/:id/generate/email-campaign",generateEmailCampaignEndpoint);

export default router;
