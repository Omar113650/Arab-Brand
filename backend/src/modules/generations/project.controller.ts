// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import Project from "../../models/project.model";
// import Result from "../../models/result.model";
// import User from "../../models/user.model";

// import { generateFullBrandKit } from "./ai.service";


// // Create Project 


// export const createProject = asyncHandler(
//   async (req: Request, res: Response) => {
//     const {
//       idea,
//       customBrandName,
//       selectedStyle,
//       selectedColors,
//     } = req.body;

//     if (!idea || !selectedStyle) {
//       res.status(400).json({
//         message: "idea و selectedStyle مطلوبين",
//       });
//       return;
//     }

//     const userId = req.session.userId!;

//     /* ── Create Project ── */

//     const project = await Project.create({
//       userId,
//       projectTitle: customBrandName || idea.slice(0, 20),
//       idea,
//       customBrandName,
//       selectedStyle,
//       selectedColors: selectedColors || [],
//       status: "generating",
//     });

//     /* ── Background AI Generation ── */

//     const runGeneration = async () => {
//       const startTime = Date.now();

//       try {
//         const brandKit = await generateFullBrandKit({
//           idea,
//           brandName: customBrandName,
//           style: selectedStyle,
//           colors: selectedColors || [],
//         });

//         console.log("BRAND KIT => ", brandKit);

//         /* ── Save Result ── */

//         await Result.create({
//           userId,
//           projectId: project._id,

//           // الهوية الكاملة
//           brandIdentity: {
//             ...brandKit.brand,
//             logo: brandKit.logo,
//           },

//           // السوشيال ميديا
//           socialMedia: brandKit.social || {},

//           // Landing Page
//           landingPage: brandKit.landing || {},

//           // البروشور
//           // brochure: brandKit.brochure || {},

//           // Scores
//           scores: brandKit.brand?.score || {},
//         });

//         /* ── Update Project Status ── */

//         project.status = "completed";

//         project.generationTime = Math.round(
//           (Date.now() - startTime) / 1000,
//         );

//         await project.save();

//         /* ── Deduct Credits ── */

//         await User.findByIdAndUpdate(userId, {
//           $inc: { credits: -1 },
//         });

//         console.log("Project completed:", project._id);
//       } catch (err) {
//         console.error(
//           "AI Generation failed for project:",
//           project._id,
//           err,
//         );

//         project.status = "failed";

//         await project.save();
//       }
//     };

//     runGeneration();

//     res.status(201).json({
//       message: "تم بدء عملية توليد البراند بنجاح",
//       projectId: project._id,
//     });
//   },
// );

// /* ───────────────────────────────────────────── */
// /* Get All Projects */
// /* ───────────────────────────────────────────── */

// export const getProjects = asyncHandler(
//   async (req: Request, res: Response) => {
//     const userId = req.session.userId!;

//     const projects = await Project.find({
//       userId,
//     }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       projects,
//     });
//   },
// );

// /* ───────────────────────────────────────────── */
// /* Get Project Status */
// /* ───────────────────────────────────────────── */

// export const getProjectStatus = asyncHandler(
//   async (req: Request, res: Response) => {
//     const userId = req.session.userId!;

//     const project = await Project.findOne({
//       _id: req.params.id,
//       userId,
//     });

//     if (!project) {
//       res.status(404).json({
//         message:
//           "المشروع غير موجود أو لا تملك صلاحية الوصول إليه",
//       });

//       return;
//     }

//     res.status(200).json({
//       project,
//     });
//   },
// );

// /* ───────────────────────────────────────────── */
// /* Get Project Result */
// /* ───────────────────────────────────────────── */

// export const getProjectResult = asyncHandler(
//   async (req: Request, res: Response) => {
//     const userId = req.session.userId!;

//     const project = await Project.findOne({
//       _id: req.params.id,
//       userId,
//     });

//     if (!project) {
//       res.status(404).json({
//         message: "المشروع غير موجود",
//       });

//       return;
//     }

//     if (project.status === "generating") {
//       res.status(202).json({
//         message: "جاري توليد البراند حالياً",
//       });

//       return;
//     }

//     if (project.status === "failed") {
//       res.status(422).json({
//         message: "فشل توليد هذا البراند",
//       });

//       return;
//     }

//     const result = await Result.findOne({
//       projectId: project._id,
//       userId,
//     });

//     if (!result) {
//       res.status(404).json({
//         message: "لم يتم العثور على نتائج لهذا المشروع",
//       });

//       return;
//     }

//     res.status(200).json({
//       result,
//     });
//   },
// );
























import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../../models/project.model";
import Result from "../../models/result.model";
import User from "../../models/user.model";
import { generateFullBrandKit } from "./ai.service";

/* ── Create Project ── */
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { idea, customBrandName, selectedStyle, selectedColors } = req.body;

    if (!idea || !selectedStyle) {
      res.status(400).json({ message: "idea و selectedStyle مطلوبين" });
      return;
    }

    const userId = req.session.userId!;

    const project = await Project.create({
      userId,
      projectTitle: customBrandName || idea.slice(0, 40),
      idea,
      customBrandName,
      selectedStyle,
      selectedColors: selectedColors || [],
      status: "generating",
    });

    /* ── Background AI Generation ── */
    const runGeneration = async () => {
      const startTime = Date.now();
      try {
        const brandKit = await generateFullBrandKit({
          idea,
          brandName: customBrandName,
          style: selectedStyle,
          colors: selectedColors || [],
        });

        console.log("BRAND KIT keys =>", Object.keys(brandKit));

        await Result.create({
          userId,
          projectId: project._id,

          // الهوية - بدون logo جوا عشان logo field منفصل
          brandIdentity: brandKit.brand,

          // الشعار كـ string مباشرة
          logo: brandKit.logo || "",

          // السوشيال ميديا
          socialMedia: brandKit.social || {},

          // Landing Page
          landingPage: brandKit.landing || {},

          // البروشور HTML القديم (للتوافق)
          brochure: {},

          // محتوى البروشور المخصص الجديد ← مهم
          brochureContent: brandKit.brochureContent || {},

          // تحليل المنافسين ← مهم
          competitors: brandKit.competitors || {},

          // الدرجات
          scores: brandKit.brand?.score || {},
        });

        project.status = "completed";
        project.generationTime = Math.round((Date.now() - startTime) / 1000);
        await project.save();

        await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

        console.log("✅ Project completed:", project._id);
      } catch (err) {
        console.error("❌ AI Generation failed for project:", project._id, err);
        project.status = "failed";
        await project.save();
      }
    };

    runGeneration();

    res.status(201).json({
      message: "تم بدء عملية توليد البراند بنجاح",
      projectId: project._id,
    });
  },
);

/* ── Get All Projects ── */
export const getProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ projects });
  },
);

/* ── Get Project Status ── */
export const getProjectStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const project = await Project.findOne({ _id: req.params.id, userId });

    if (!project) {
      res.status(404).json({ message: "المشروع غير موجود أو لا تملك صلاحية الوصول إليه" });
      return;
    }

    res.status(200).json({ project });
  },
);

/* ── Delete Project ── */
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.userId!;

    const project = await Project.findOneAndDelete({ _id: req.params.id, userId });
    if (!project) {
      res.status(404).json({ message: "المشروع غير موجود" });
      return;
    }

    // احذف الـ result كمان
    await Result.deleteOne({ projectId: req.params.id, userId });

    res.status(200).json({ message: "تم حذف المشروع" });
  },
);

/* ── Get Project Result ── */
export const getProjectResult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.userId!;

    const project = await Project.findOne({ _id: req.params.id, userId });

    if (!project) {
      res.status(404).json({ message: "المشروع غير موجود" });
      return;
    }

    if (project.status === "generating") {
      res.status(202).json({ message: "جاري توليد البراند حالياً" });
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

    // ── إذا كان المشروع قديم وناقص competitors أو brochureContent، نولدهم الآن ──
    const needsCompetitors = !result.competitors || Object.keys(result.competitors || {}).length === 0;
    const needsBrochure    = !result.brochureContent || Object.keys(result.brochureContent || {}).length === 0;

    if (needsCompetitors || needsBrochure) {
      try {
        const { generateFullBrandKit } = await import("./ai.service");

        const updates: Record<string, any> = {};

        if (needsCompetitors) {
          // استخدم callAI مباشرة للمنافسين فقط
          const { generateCompetitorsOnly } = await import("./ai.service");
          const competitors = await generateCompetitorsOnly({
            idea: project.idea,
            brandName: project.customBrandName || result.brandIdentity?.recommendedName || "",
            audience: result.brandIdentity?.strategy?.audience || "",
            positioning: result.brandIdentity?.strategy?.positioning || "",
          });
          if (competitors) updates.competitors = competitors;
        }

        if (needsBrochure) {
          const { generateBrochureOnly } = await import("./ai.service");
          const brochureContent = await generateBrochureOnly({
            idea: project.idea,
            brandName: project.customBrandName || result.brandIdentity?.recommendedName || "",
            tagline: result.brandIdentity?.tagline?.ar || "",
            value: result.brandIdentity?.strategy?.value || "",
            audience: result.brandIdentity?.strategy?.audience || "",
            messages: result.brandIdentity?.messages || [],
            style: project.selectedStyle,
          });
          if (brochureContent) updates.brochureContent = brochureContent;
        }

        if (Object.keys(updates).length > 0) {
          await Result.findByIdAndUpdate(result._id, updates);
          Object.assign(result, updates);
        }
      } catch (err) {
        console.error("Background enrichment failed:", err);
        // مش بنفشّل الـ request لو الـ enrichment فشل
      }
    }

    res.status(200).json({ result });
  },
);

/* ── Generate Extra Social Content (paid) ── */
export const generateExtraSocial = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.userId!;

    const user = await User.findById(userId);
    if (!user || user.credits < 1) {
      res.status(402).json({ message: "رصيدك غير كافٍ. يرجى شحن رصيدك للمتابعة." });
      return;
    }

    const project = await Project.findOne({ _id: req.params.id, userId });
    if (!project) { res.status(404).json({ message: "المشروع غير موجود" }); return; }

    const result = await Result.findOne({ projectId: project._id, userId });
    if (!result) { res.status(404).json({ message: "نتائج المشروع غير موجودة" }); return; }

    const { generateExtraSocialContent } = await import("./ai.service");

    const extra = await generateExtraSocialContent({
      idea: project.idea,
      brandName: project.customBrandName || result.brandIdentity?.recommendedName || "",
      style: project.selectedStyle,
      tagline: result.brandIdentity?.tagline?.ar || "",
      audience: result.brandIdentity?.strategy?.audience || "",
      value: result.brandIdentity?.strategy?.value || "",
    });

    const cur = result.socialMedia || {};
    const updated = {
      ...cur,
      contentMap:  cur.contentMap  || [],
      postIdeas:   [...(cur.postIdeas  || []), ...(extra.postIdeas  || [])],
      videoIdeas:  [...(cur.videoIdeas || []), ...(extra.videoIdeas || [])],
      instagram:   [...(cur.instagram  || []), ...(extra.instagram  || [])],
      twitter:     [...(cur.twitter    || []), ...(extra.twitter    || [])],
    };

    await Result.findByIdAndUpdate(result._id, { socialMedia: updated });
    await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

    res.status(200).json({
      message: "تم توليد محتوى إضافي بنجاح",
      social: updated,
      creditsLeft: user.credits - 1,
    });
  },
);