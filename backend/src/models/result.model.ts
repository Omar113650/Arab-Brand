import mongoose, { Schema, Document } from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;

  projectId: mongoose.Types.ObjectId;

  brandIdentity: any;

  logo: any;

  socialMedia: any;

  landingPage: any;

  brochure: any;

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

    brandIdentity: {
      type: Object,
    },

    logo: {
      type: Object,
    },

    socialMedia: {
      type: Object,
    },

    landingPage: {
      type: Object,
    },

    brochure: {
      type: Object,
    },

    scores: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const Result = mongoose.model<IResult>("Result", resultSchema);

export default Result;
