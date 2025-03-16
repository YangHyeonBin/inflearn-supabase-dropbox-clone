"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFileMutation } from "services/useFileQueries";

export default function FileDropzone() {
    const updateFile = useUploadFileMutation();

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append(file.name, file); // 식별할 수 있는 형태로 저장
            });

            await updateFile.mutateAsync(formData);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        },
    });

    return (
        <div
            {...getRootProps()}
            className="w-full flex flex-col items-center py-20 border-2 border-dashed border-slate-300 cursor-pointer">
            <input {...getInputProps()} />
            <div className="flex items-center gap-2">
                {updateFile.isPending ? (
                    <>
                        <i className="fas fa-spinner animate-spin text-gray-400"></i>
                        <span className="text-gray-400">파일 업로드 중...</span>
                    </>
                ) : (
                    <>
                        <i className="fas fa-cloud-upload-alt text-gray-400"></i>
                        <span className="text-gray-400">
                            {isDragActive
                                ? "파일을 여기에 놓아주세요"
                                : "파일을 끌어다 놓거나 클릭해서 업로드할 수 있어요"}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
