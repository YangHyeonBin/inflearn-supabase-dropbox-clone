import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteFile,
    // getFilesFromDB,
    // saveFileToDB,
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
        //  async (formData: FormData) => {
        //     const data = await uploadFile(formData);
        //     // const file = formData.get("file") as File;

        //     // if (data && data.path) {
        //     //     await saveFileToDB({
        //     //         id: data.id,
        //     //         name: file.name,
        //     //         path: file.name,
        //     //         size: file.size,
        //     //         type: file.type,
        //     //         created_at: new Date().toISOString(),
        //     //         updated_at: new Date().toISOString(),
        //     //     });
        //     // }
        //     return data;
        // },
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
