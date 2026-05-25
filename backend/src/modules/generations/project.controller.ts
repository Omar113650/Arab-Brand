import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../../models/project.model";
import Result from "../../models/result.model";
import User from "../../models/user.model";
import { generateFullBrandKit } from "./ai.service";

/* ── Create Project and start generation ── */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { idea, customBrandName, selectedStyle, selectedColors } = req.body;
  const userApiKey = req.body.apiKey || req.headers["x-gemini-api-key"] || process.env.GEMINI_API_KEY;

  if (!idea || !selectedStyle) {
    res.status(400).json({ message: "idea و selectedStyle مطلوبين" });
    return;
  }

  if (!userApiKey) {
    res.status(400).json({ message: "الرجاء توفير Gemini API Key لتشغيل التوليد" });
    return;
  }

  const userId = req.session.userId!;

  // Create Project in DB
  const project = await Project.create({
    userId,
    projectTitle: customBrandName || idea.slice(0, 20),
    idea,
    customBrandName,
    selectedStyle,
    selectedColors: selectedColors || [],
    status: "generating",
    aiModel: "gemini-2.0-flash",
  });

  // Start generation asynchronously in background
  const runGeneration = async () => {
    const startTime = Date.now();
    try {
      const brandKit = await generateFullBrandKit({
        apiKey: userApiKey as string,
        idea,
        brandName: customBrandName,
        style: selectedStyle,
        colors: selectedColors || [],
      });

      // Save results
      await Result.create({
        userId,
        projectId: project._id,
        brandIdentity: brandKit.brand,
        logo: brandKit.logo,
        socialMedia: brandKit.social,
        landingPage: brandKit.landing,
        brochure: brandKit.brand, // mapping brochure to use brand details
        scores: brandKit.brand.score,
      });

      // Update Project Status
      project.status = "completed";
      project.generationTime = Math.round((Date.now() - startTime) / 1000);
      await project.save();

      // Deduct credits from user
      await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });
    } catch (err) {
      console.error("AI Generation failed for project:", project._id, err);
      project.status = "failed";
      await project.save();
    }
  };

  // Run in background without await
  runGeneration();

  res.status(201).json({
    message: "تم بدء عملية توليد البراند بنجاح في الخلفية",
    projectId: project._id,
  });
});

/* ── Get all projects for logged-in user ── */
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const projects = await Project.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ projects });
});

/* ── Get status of a single project ── */
export const getProjectStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const project = await Project.findOne({ _id: req.params.id, userId });

  if (!project) {
    res.status(404).json({ message: "المشروع غير موجود أو لا تملك صلاحية الوصول إليه" });
    return;
  }

  res.status(200).json({ project });
});

/* ── Get results of a project ── */
export const getProjectResult = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const project = await Project.findOne({ _id: req.params.id, userId });

  if (!project) {
    res.status(404).json({ message: "المشروع غير موجود" });
    return;
  }

  if (project.status === "generating") {
    res.status(202).json({ message: "جاري توليد البراند حالياً، يرجى الانتظار" });
    return;
  }

  if (project.status === "failed") {
    res.status(422).json({ message: "فشل توليد هذا البراند" });
    return;
  }

  const result = await Result.findOne({ projectId: project._id, userId });
  if (!result) {
    res.status(404).json({ message: "لم يتم العثور على نتائج لهذا المشروع" });
    return;
  }

  res.status(200).json({ result });
});
