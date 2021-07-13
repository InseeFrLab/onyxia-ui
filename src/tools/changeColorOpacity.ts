import Color from "color";

export function changeColorOpacity(params: {
    color: string;
    opacity: number;
}): string {
    const { color, opacity } = params;
    return new Color(color).rgb().alpha(opacity).string();
}
