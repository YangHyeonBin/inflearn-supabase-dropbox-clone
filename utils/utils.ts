// file size: bytes to human readable
export function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// format date
export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

// encode file name: Base64
export function getEncodedFileName(filename: string): string {
    // 파일 확장자 분리
    const lastDotIndex = filename.lastIndexOf(".");
    const ext = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
    const name =
        lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;

    // 파일명만 Base64 인코딩 (확장자는 유지)
    const encodedName = Buffer.from(name)
        .toString("base64")
        .replace(/\+/g, "-") // URL 안전 Base64로 변환
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return `b64_${encodedName}${ext}`;
}

// decode file name
export function getDecodedFileName(filename: string) {
    if (!filename.startsWith("b64_")) return filename;

    // 확장자 분리
    const lastDotIndex = filename.lastIndexOf(".");
    const ext = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
    const encodedName =
        lastDotIndex !== -1
            ? filename.substring(4, lastDotIndex)
            : filename.substring(4);

    // URL 안전 Base64에서 일반 Base64로 변환 후 디코딩
    const paddedName = encodedName.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (paddedName.length % 4)) % 4);

    const decodedName = Buffer.from(paddedName + padding, "base64").toString();
    return decodedName + ext;
}
