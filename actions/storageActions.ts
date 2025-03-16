"use server";

import { createServerSupabaseClient } from "utils/supabase/server";
import { getDecodedFileName, getEncodedFileName } from "utils/utils";

function handleError(error: Error) {
    console.error(error);
    throw error;
}

export async function uploadFile(formData: FormData) {
    const supabase = await createServerSupabaseClient(); // await으로 수퍼베이스 클라이언트 생성
    const files = Array.from(formData.entries()).map(
        ([name, file]) => ({ name, file }) // destructuring해 file만 뽑아옴
    );

    // file.name이 aws s3 safe하지 않을 경우, 이름을 변경해서 업로드 해야 함
    const processedFiles = files.map(({ name, file }) => {
        const originalName = name;
        console.log(name);
        const s3Compatible = /^[a-zA-Z0-9._-]+$/.test(originalName);
        console.log("s3 ok:", s3Compatible);

        // S3 호환되면 그대로, 아니면 인코딩 접두사 추가
        const s3Name = s3Compatible
            ? originalName
            : getEncodedFileName(originalName);
        console.log(s3Name);

        return {
            file,
            s3Name,
            // originalName,
        };
    });

    // upload
    const results = await Promise.all(
        processedFiles.map((file) =>
            supabase.storage
                .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
                .upload(file.s3Name, file.file, {
                    upsert: true,
                    // metadata: {
                    //     originalName: file.originalName,
                    // },
                })
        )
    );

    if (results.some((result) => result.error)) {
        throw new Error("Failed to upload one or more files");
    }

    return results;
}

export async function searchFile(searchQuery: string) {
    const supabase = await createServerSupabaseClient();
    const encodedQuery = getEncodedFileName(searchQuery);

    const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .list(
            undefined, // string | undefined인 path, path로 찾는거 아니니 undefined 넘김
            {
                // search options
                search: encodedQuery,
            }
        );

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
    console.log(filename);
    console.log(path);

    return { data, filename };
}

export async function deleteFile(path: string) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .remove([path]); // 배열, 한번에 여러 파일 삭제 가능

    if (error) {
        handleError(error);
    }

    return data;
}
