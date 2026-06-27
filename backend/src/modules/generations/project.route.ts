






// import { Router } from "express";
// import { protect } from "../../middlewares/auth.middleware";
// import {
//   createProject,
//   getProjects,
//   getProjectStatus,
//   getProjectResult,
//   deleteProject,
//   generateExtraSocial,
//   regenerateSection,
// } from "./project.controller";

// const router = Router();

// // ── Apply auth middleware to all routes ──
// router.use(protect);

// // ── Core project routes ──
// router.post("/",           createProject);
// router.get("/",            getProjects);
// router.get("/:id",         getProjectStatus);
// router.get("/:id/result",  getProjectResult);
// router.delete("/:id",      deleteProject);

// // ── Extra content (paid) ──
// router.post("/:id/extra-social",              generateExtraSocial);

// // ── Regenerate individual sections ──
// // section = objections | productFocus | launchPlan | swot | competitors | brochureContent
// router.post("/:id/regenerate/:section",       regenerateSection);

// export default router;







// الي عملته يوم الماتش 





// import { Router } from "express";
// import { protect } from "../../middlewares/auth.middleware";
// import {
//   createProject,
//   getProjects,
//   getProjectStatus,
//   getProjectResult,
//   deleteProject,
//   generateExtraSocial,
//   regenerateSection,
// } from "./project.controller";

// const router = Router();

// // ── Apply auth middleware to all routes ──
// router.use(protect);

// // ── Core project routes ──
// router.post("/",          createProject);
// router.get("/",           getProjects);
// router.get("/:id",        getProjectStatus);
// router.get("/:id/result", getProjectResult);
// router.delete("/:id",     deleteProject);

// // ── Extra content (paid) ──
// router.post("/:id/extra-social", generateExtraSocial);

// // ── Regenerate individual sections ──
// // section = objections | productFocus | launchPlan | swot | competitors | brochureContent | ageSegments
// router.post("/:id/regenerate/:section", regenerateSection);

// export default router;





















import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  getProjectStatus,
  getProjectResult,
  deleteProject,
  generateExtraSocial,
  regenerateSection,
  CountProject
} from "./project.controller";

const router = Router();

// ── Apply auth middleware to all routes ──
router.use(protect);

router.get("/count", CountProject);
// ── Core project routes ──
router.post("/",          createProject);
router.get("/",           getProjects);
router.get("/:id",        getProjectStatus);
router.get("/:id/result", getProjectResult);
router.delete("/:id",     deleteProject);


// ── Extra content (paid) ──
router.post("/:id/extra-social", generateExtraSocial);

// ── Regenerate individual sections ──
// section = objections | productFocus | launchPlan | swot | competitors | brochureContent | ageSegments | businessOverview | agePreferences | faq
router.post("/:id/regenerate/:section", regenerateSection);

export default router;
























