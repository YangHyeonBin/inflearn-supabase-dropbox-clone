"use client";

import { FileData } from "database_type";
import { useDeleteFileMutation } from "services/useFileQueries";
import { getImageUrl } from "utils/supabase/storage";

export default function DropboxFile({ file }: { file: any }) {
    const deleteFile = useDeleteFileMutation();

    return (
        <div className="w-full flex flex-col gap-2 border border-gray-300 rounded-md shadow-sm p-2 relative">
            <div className="flex items-center p-2">
                <img
                    src={getImageUrl(file.name)}
                    alt={file.name}
                    className="rounded-md"
                />
            </div>
            <div className="text-sm px-2">{file.name}</div>

            <div className="absolute top-2 right-3 flex gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md">
                    <i className="fas fa-download text-green-500"></i>
                </button>
                <button
                    onClick={() => deleteFile.mutate(file.name)}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md">
                    {deleteFile.isPending ? (
                        <i className="fas fa-spinner animate-spin"></i>
                    ) : (
                        <i className="fas fa-trash text-red-500"></i>
                    )}
                </button>
            </div>
        </div>
    );
}
