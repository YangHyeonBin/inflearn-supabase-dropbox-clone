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
        onSuccess: (data) => {
            const url = data.publicUrl;
            const link = document.createElement("a");
            link.href = url;
            link.download = url.split("/").pop()!; // file name 추출
            link.click();
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
