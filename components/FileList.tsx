"use client";

import DropboxFile from "./DropboxFile";

export default function FileList() {
    return (
        // default: 2칸의 그리드
        // md: 태블릿 사이즈일 땐 3칸의 그리드
        // lg: 더 큰 사이즈일 땐 4칸의 그리드
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <DropboxFile />
            <DropboxFile />
            <DropboxFile />
            <DropboxFile />
        </section>
    );
}
