import { useTheme } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

function TestSpacing() {
    const theme = useTheme();

    return (
        <>
            {([1, 2, 3, 4, 5] as const).map(factor => (
                <div
                    key={factor}
                    style={{
                        "fontSize": theme.spacing(factor),
                        "width": "1em",
                        "height": "1em",
                        "backgroundColor": "blue",
                        "margin": 20,
                    }}
                />
            ))}
        </>
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { TestSpacing },
});

export default meta;

export const VueDefault = getStory({});
