"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error: Error) {
    console.error(error);
    throw error;
}

export async function uploadFile(formData: FormData) {
    const supabase = await createServerSupabaseClient(); // await으로 수퍼베이스 클라이언트 생성
    const files = Array.from(formData.entries()).map(
        ([name, file]) => file as File // destructuring해 file만 뽑아옴
    );

    // upload
    const results = await Promise.all(
        files.map((file) =>
            supabase.storage
                .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
                .upload(file.name, file, { upsert: true })
        )
    );

    if (results.some((result) => result.error)) {
        throw new Error("Failed to upload one or more files");
    }

    return results;
}

export async function searchFile(searchQuery: string) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .list(
            undefined, // string | undefined인 path, path로 찾는거 아니니 undefined 넘김
            {
                // search options
                search: searchQuery,
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

    return data;
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
