import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <MyComponent />
    </ThemeProvider>,
);
