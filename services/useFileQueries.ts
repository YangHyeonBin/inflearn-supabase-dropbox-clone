import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteFile,
    downloadFile,
    searchFile,
    uploadFile,
} from "actions/storageActions";

export function useSearchFileQuery({ searchInput }: { searchInput: string }) {
    return useQuery({
        queryKey: ["files", searchInput],
        queryFn: () => searchFile(searchInput),
    });
}

export function useUploadFileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFile, // 이렇게 해도 된다!
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["files"],
            });
        },
        onError: (error) => {
            console.error(error);
        },
    });
}

export function useDownloadFileMutation() {
    return useMutation({
        mutationFn: downloadFile,
        onSuccess: async (data) => {
            // 1. 파일 URL에서 데이터 가져오기
            const response = await fetch(data.data.publicUrl);
            const blob = await response.blob();

            // 2. Blob URL 생성
            // 로컬 Blobk URL을 사용하면 download 속성이 항상 적용되어,
            // 디코딩된 파일명으로 저장 가능함
            const blobUrl = URL.createObjectURL(blob);

            // 3. 다운로드 링크 생성 및 클릭
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = data.filename; // 원본 파일명 사용
            link.click();

            // 4. Blob URL 정리
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        },
        onError: (error) => {
            console.error(error);
        },
    });
}

export function useDeleteFileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["files"],
            });
        },
        onError: (error) => {
            console.error(error);
        },
    });
}
