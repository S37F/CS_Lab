
export const encodeRLE = (text: string): string => {
    if (!text) return '';
    return text.replace(/(.)\1*/g, (match, char) => match.length + char);
};

export const decodeRLE = (encodedText: string): string => {
    if (!encodedText) return '';
    // Use a try-catch to handle malformed input during live typing
    try {
        return encodedText.replace(/(\d+)(.)/g, (_, count, char) => char.repeat(parseInt(count, 10)));
    } catch (e) {
        // If there's an error (e.g., count is too large), return an empty string
        return "Invalid RLE format";
    }
};
