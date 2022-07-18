import { Markdown } from "../Markdown";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Markdown },
    "defaultWidth": 500,
});

export default meta;

export const VueNoTitle = getStory({
    "children": `# This is a title  
This is a paragraph with [a link](https://www.example.com)  
`,
});
