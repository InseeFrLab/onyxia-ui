import { Markdown } from "../Markdown";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { Markdown },
    defaultWidth: 500,
});

export default meta;

export const DefaultView = getStory({
    children: `# This is a title  
This is a paragraph with [a link](https://www.example.com)  
`,
});

export const InlineView = getStory({
    inline: true,
    children: `Hello [with a link](https://www.example.com) world`,
});
