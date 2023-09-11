import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { splashScreen } from "./theme";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider splashScreen={splashScreen} >
        <MyComponent />
    </ThemeProvider>
);
