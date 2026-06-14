

// import mongoose, { Schema, Document } from "mongoose";

// export interface IResult extends Document {
//   userId: mongoose.Types.ObjectId;
//   projectId: mongoose.Types.ObjectId;
//   brandIdentity: any;
//   logo: any;
//   socialMedia: any;
//   landingPage: any;
//   brochure: any;
//   brochureContent: any;
//   competitors: any;
//   objections: any;       // NEW: ردود على اعتراضات العملاء
//   productFocus: any;     // NEW: اقتراح المنتجات وتحديد الأولوية
//   launchPlan: any;       // NEW: خطة الإطلاق
//   swot: any;             // NEW: تحليل SWOT والمخاطر
//   launchPlanLegacy: any; // kept for backward compat
//   buyerPersona: any;
//   adScripts: any;
//   emailCampaign: any;
//   scores: any;
// }

// const resultSchema = new Schema<IResult>(
//   {
//     userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
//     projectId:     { type: Schema.Types.ObjectId, ref: "Project", required: true },
//     brandIdentity: { type: Schema.Types.Mixed },
//     logo:          { type: Schema.Types.Mixed },
//     socialMedia:   { type: Schema.Types.Mixed },
//     landingPage:   { type: Schema.Types.Mixed },
//     brochure:      { type: Schema.Types.Mixed },
//     brochureContent: { type: Schema.Types.Mixed },
//     competitors:   { type: Schema.Types.Mixed },
//     // ── New sections ──
//     objections:    { type: Schema.Types.Mixed },
//     productFocus:  { type: Schema.Types.Mixed },
//     launchPlan:    { type: Schema.Types.Mixed },
//     swot:          { type: Schema.Types.Mixed },
//     // ── Legacy / future fields ──
//     launchPlanLegacy: { type: Schema.Types.Mixed },
//     buyerPersona:  { type: Schema.Types.Mixed },
//     adScripts:     { type: Schema.Types.Mixed },
//     emailCampaign: { type: Schema.Types.Mixed },
//     scores:        { type: Schema.Types.Mixed },
//   },
//   { timestamps: true },
// );

// const Result = mongoose.model<IResult>("Result", resultSchema);
// export default Result;



























// اليوم














// اخر نسخه بتاريح 6/9

import mongoose, { Schema, Document } from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  brandIdentity: any;
  logo: any;
  socialMedia: any;
  landingPage: any;
  brochure: any;
  brochureContent: any;
  competitors: any;
  objections: any;
  productFocus: any;
  launchPlan: any;
  swot: any;
  ageSegments: any;
  businessOverview: any;
  agePreferences: any;
  faq: any;
  buyerPersona: any;
  videoScripts: any;   // ← جديد (بدل adScripts)
  adScripts: any;      // ← legacy (متمسهوش عشان البيانات القديمة)
  emailCampaign: any;
  launchPlanLegacy: any;
  scores: any;
}

const resultSchema = new Schema<IResult>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId:        { type: Schema.Types.ObjectId, ref: "Project", required: true },
    brandIdentity:    { type: Schema.Types.Mixed },
    logo:             { type: Schema.Types.Mixed },
    socialMedia:      { type: Schema.Types.Mixed },
    landingPage:      { type: Schema.Types.Mixed },
    brochure:         { type: Schema.Types.Mixed },
    brochureContent:  { type: Schema.Types.Mixed },
    competitors:      { type: Schema.Types.Mixed },
    objections:       { type: Schema.Types.Mixed },
    productFocus:     { type: Schema.Types.Mixed },
    launchPlan:       { type: Schema.Types.Mixed },
    swot:             { type: Schema.Types.Mixed },
    ageSegments:      { type: Schema.Types.Mixed },
    businessOverview: { type: Schema.Types.Mixed, default: {} },
    agePreferences:   { type: Schema.Types.Mixed, default: {} },
    faq:              { type: Schema.Types.Mixed, default: {} },
    buyerPersona:     { type: Schema.Types.Mixed, default: {} }, // ← جديد
    videoScripts:     { type: Schema.Types.Mixed, default: {} }, // ← جديد
    adScripts:        { type: Schema.Types.Mixed },              // ← legacy
    emailCampaign:    { type: Schema.Types.Mixed, default: {} }, // ← جديد default
    launchPlanLegacy: { type: Schema.Types.Mixed },
    scores:           { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

const Result = mongoose.model<IResult>("Result", resultSchema);
export default Result;