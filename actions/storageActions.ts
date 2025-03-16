"use server";

import { FileDataInput } from "database_type";
import { createServerSupabaseClient } from "utils/supabase/server";
import { getDecodedFileName, getEncodedFileName } from "utils/utils";

function handleError(error: Error) {
    console.error(error);
    throw error;
}

export async function uploadFile(formData: FormData) {
    const supabase = await createServerSupabaseClient(); // await으로 수퍼베이스 클라이언트 생성
    const files = Array.from(formData.entries()).map(
        ([name, file]) => ({ name, file: file as File }) // destructuring해 file만 뽑아옴
    );

    // file.name이 aws s3 safe하지 않을 경우, 이름을 변경해서 업로드 해야 함
    const processedFiles = files.map(({ name, file }) => {
        const originalName = name;
        const s3Compatible = /^[a-zA-Z0-9._-]+$/.test(originalName);

        // S3 호환되면 그대로, 아니면 인코딩 접두사 추가
        const s3Name = s3Compatible
            ? originalName
            : getEncodedFileName(originalName);

        return {
            file,
            s3Name,
            originalName,
        };
    });

    // upload
    const results = await Promise.all(
        processedFiles.map((file) =>
            supabase.storage
                .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
                .upload(file.s3Name, file.file, {
                    // upsert: true,
                })
        )
    );

    if (results.some((result) => result.error)) {
        throw new Error("Failed to upload one or more files");
    }

    // db에 메타데이터 저장
    const fileMedatadataList: FileDataInput[] = processedFiles
        .map((fileInfo, index) => {
            const uploadResult = results[index];
            if (uploadResult.error) return null;

            return {
                id: uploadResult?.data?.id || crypto.randomUUID(),
                encoded_name: fileInfo.s3Name,
                decoded_name: fileInfo.originalName,
                size: fileInfo.file.size,
                type: fileInfo.file.type,
                path: fileInfo.s3Name,
                updated_at: new Date().toISOString(),
            };
        })
        .filter(Boolean) as FileDataInput[]; // null 제외

    try {
        await saveFileMetadata(fileMedatadataList);
    } catch (e) {
        console.error("Failed to save metatdata,", e);
    }

    return results;
}

async function saveFileMetadata(files: FileDataInput[]) {
    const supabase = await createServerSupabaseClient();
    const results = await Promise.all(
        files.map((file) =>
            supabase.from("file").upsert(
                {
                    id: file.id,
                    encoded_name: file.encoded_name,
                    decoded_name: file.decoded_name,
                    size: file.size,
                    type: file.type,
                    path: file.path,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "id",
                }
            )
        )
    );

    if (results.some((result) => result.error)) {
        throw new Error("Failed to save metadata for one or more files");
    }

    return results;
}

export async function searchFile(searchQuery: string) {
    const supabase = await createServerSupabaseClient();
    console.log(searchQuery);

    // db에서 조회
    const { data, error } = await supabase
        .from("file")
        .select("*")
        .like("decoded_name", `%${searchQuery}%`); // 한국어 불가

    console.log(data);

    if (error) {
        handleError(error);
    }

    return data;
}

export async function downloadFile(path: string) {
    const supabase = await createServerSupabaseClient();

    const { data } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        // .download(path);
        .getPublicUrl(path, { download: true });

    // 원본 파일명 추출 및 디코딩
    const filename = path.startsWith("b64_") ? getDecodedFileName(path) : path;

    return { data, filename };
}

export async function deleteFile(path: string) {
    const supabase = await createServerSupabaseClient();

    // 1. storage에서 삭제
    const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .remove([path]); // 배열, 한번에 여러 파일 삭제 가능

    if (error) {
        handleError(error);
    }

    // 2. db에서 삭제
    const { data: dbData, error: dbError } = await supabase
        .from("file")
        .delete()
        .eq("path", path);

    if (dbError) {
        handleError(dbError);
    }

    return { data, dbData };
}
