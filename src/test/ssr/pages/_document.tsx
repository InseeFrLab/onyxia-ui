import { createDocument } from "tss-react/nextJs";
import { muiCache } from "../shared/theme";

const { Document } = createDocument({ "caches": [muiCache] });

export default Document;
