// import mongoose, { Schema, Document } from "mongoose";

// export interface IResult extends Document {
//   userId: mongoose.Types.ObjectId;

//   projectId: mongoose.Types.ObjectId;

//   brandIdentity: any;

//   logo: any;

//   socialMedia: any;

//   landingPage: any;

//   brochure: any;

//   scores: any;
// }

// const resultSchema = new Schema<IResult>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     projectId: {
//       type: Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },

//     brandIdentity: {
//       type: Object,
//     },

//     logo: {
//       type: Object,
//     },

//     socialMedia: {
//       type: Object,
//     },

//     landingPage: {
//       type: Object,
//     },

//     brochure: {
//       type: Object,
//     },

//     scores: {
//       type: Object,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const Result = mongoose.model<IResult>("Result", resultSchema);

// export default Result;


























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
  scores: any;
}

const resultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    brandIdentity:   { type: Schema.Types.Mixed },
    logo:            { type: Schema.Types.Mixed },
    socialMedia:     { type: Schema.Types.Mixed },
    landingPage:     { type: Schema.Types.Mixed },
    brochure:        { type: Schema.Types.Mixed },
    brochureContent: { type: Schema.Types.Mixed },
    competitors:     { type: Schema.Types.Mixed },
    scores:          { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
);

const Result = mongoose.model<IResult>("Result", resultSchema);

export default Result;