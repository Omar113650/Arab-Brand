import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { connectDB } from "./config/connectDB";
import app from "./app";

connectDB();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
