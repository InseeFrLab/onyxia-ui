function getRGB(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(l1: number, l2: number): number {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function getContrastRatio(params: {
    backgroundHex: string;
    textHex: string;
}) {
    const { backgroundHex, textHex } = params;

    const backgroundLuminance = relativeLuminance(getRGB(backgroundHex));
    const textLuminance = relativeLuminance(getRGB(textHex));

    return contrastRatio(backgroundLuminance, textLuminance);
}
