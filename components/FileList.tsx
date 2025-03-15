"use client";

import { useSearchFileQuery } from "services/useFileQueries";
import DropboxFile from "./DropboxFile";

/**
 *
 * @param searchInput 검색 결과를 보여주기 위해 searchInput 받음
 * @returns 이미지 리스트
 */
export default function FileList({ searchInput }: { searchInput: string }) {
    const searchFile = useSearchFileQuery({ searchInput });

    if (searchFile.error) {
        console.error(searchFile.error);
        return <div>에러가 발생했습니다.</div>;
    }

    if (searchFile.isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <i className="fas fa-spinner animate-spin size-4"></i>
            </div>
        );
    }

    if (!searchFile.data?.length) {
        return <div>파일이 없습니다.</div>;
    }

    // 파일 데이터가 어떤 형태인지 확인
    // console.log(searchFile.data);

    return (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {/* default: 2칸의 그리드 */}
            {/* md: 태블릿 사이즈일 땐 3칸의 그리드 */}
            {/* lg: 더 큰 사이즈일 땐 4칸의 그리드 */}
            {searchFile.data?.map((file) => (
                <DropboxFile key={file.id} file={file} />
            ))}
        </section>
    );
}
