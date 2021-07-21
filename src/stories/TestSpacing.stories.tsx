import { useTheme } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

function TestSpacing() {
    const theme = useTheme();

    return (
        <>
            {([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8] as const).map(
                factor => (
                    <div
                        key={factor}
                        style={{
                            "fontSize": theme.spacing(factor),
                            "width": "1em",
                            "height": "1em",
                            "backgroundColor":
                                Number.isInteger(factor) && factor <= 6
                                    ? "blue"
                                    : "lightblue",
                            "margin": 20,
                        }}
                    />
                ),
            )}
        </>
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { TestSpacing },
});

export default meta;

export const VueDefault = getStory({});
