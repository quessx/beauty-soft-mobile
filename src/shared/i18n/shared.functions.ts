export function objectGet(obj: any, path: string, defaultValue: string | null = null) {
    const chunks = path.split('.').reverse();

    const result = extractPath(obj, chunks);

    return result === undefined ? defaultValue : result;
}

function extractPath(obj: any, chunks: string[] = []) {
    const chunk: string = chunks.pop() || '';

    if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty(chunk)) {
        obj = obj[chunk];
    } else {
        return undefined;
    }

    if (chunks.length && !! obj) {
        return extractPath(obj, chunks);
    }

    return obj;
}
