// import mongoose, { Schema, Document } from "mongoose";

// export interface IProject extends Document {
//   userId: mongoose.Types.ObjectId;

//   projectTitle: string;

//   idea: string;

//   customBrandName?: string;

//   selectedStyle: string;

//   selectedColors: string[];

//   status: "generating" | "completed" | "failed";

//   aiModel: string;

//   generationTime?: number;
// }

// const projectSchema = new Schema<IProject>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     projectTitle: {
//       type: String,
//       required: true,
//     },

//     idea: {
//       type: String,
//       required: true,
//     },

//     customBrandName: {
//       type: String,
//     },

//     selectedStyle: {
//       type: String,
//       required: true,
//     },

//     selectedColors: [
//       {
//         type: String,
//       },
//     ],

//     status: {
//       type: String,
//       enum: ["generating", "completed", "failed"],
//       default: "generating",
//     },

//     aiModel: {
//       type: String,
//       default: "llama3",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const Project = mongoose.model<IProject>("Project", projectSchema);

// export default Project;











import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  projectTitle: string;
  idea: string;
  customBrandName?: string;
  selectedStyle: string;
  selectedColors: string[];
  status: "generating" | "completed" | "failed";
  aiModel: string;
  generationTime?: number;
  failureReason?: string;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    idea: {
      type: String,
      required: true,
    },
    customBrandName: {
      type: String,
    },
    selectedStyle: {
      type: String,
      required: true,
    },
    selectedColors: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
    aiModel: {
      type: String,
      default: "llama3",
    },
    generationTime: {
      type: Number,
    },
    failureReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;