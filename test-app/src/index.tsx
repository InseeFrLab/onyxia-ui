import { createRoot } from "react-dom/client";
import { OnyxiaUi } from "./theme";
import { MyComponent } from "./MyComponent";

createRoot(document.getElementById("root")!).render(
    <OnyxiaUi>
        <MyComponent />
    </OnyxiaUi>,
);
