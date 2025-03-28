"use client";

import { FileData } from "database_type";
import {
    useDeleteFileMutation,
    useDownloadFileMutation,
} from "services/useFileQueries";
import { getImageUrl } from "utils/supabase/storage";
import { formatBytes, formatDate } from "utils/utils";

export default function DropboxFile({ file }: { file: FileData }) {
    const downloadFile = useDownloadFileMutation();
    const deleteFile = useDeleteFileMutation();

    return (
        <div className="w-full flex flex-col gap-3 border border-gray-300 rounded-md shadow-sm p-2 relative">
            <div className="flex items-center p-2">
                <img
                    src={getImageUrl(file.encoded_name)}
                    alt={file.encoded_name}
                    className="rounded-md"
                />
            </div>
            <div className="text-md px-2">{file.decoded_name}</div>
            <div className="text-sm px-2 flex flex-row gap-2 text-gray-500">
                <span>{file.type}</span>
                <span>-</span>
                <span>{formatBytes(file.size)}</span>
            </div>
            <div className="text-sm px-2  flex flex-col gap-1 mb-1">
                <span className="text-gray-500">최근 수정</span>
                <span className="text-xs">
                    {formatDate(file.updated_at || file.created_at)}
                </span>
            </div>

            <div className="absolute top-2 right-3 flex gap-2">
                <button
                    onClick={() => downloadFile.mutate(file.encoded_name)}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md">
                    <i className="fas fa-download text-green-500"></i>
                </button>
                <button
                    onClick={() => deleteFile.mutate(file.path)}
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
