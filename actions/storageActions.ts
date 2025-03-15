"use server";

import { FileData } from "database_type";
import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error: Error) {
    console.error(error);
    throw error;
}

// export async function saveFileToDB(fileData: FileData) {
//     const supabase = await createServerSupabaseClient();
//     const { data, error } = await supabase
//         .from("file")
//         .insert([fileData])
//         .select();

//     if (error) {
//         handleError(error);
//     }

//     return data;
// }

export async function uploadFile(formData: FormData) {
    const supabase = await createServerSupabaseClient(); // await으로 수퍼베이스 클라이언트 생성
    const file = formData.get("file") as File; // 'file'이라는 키로 저장했던 파일을 가져옴

    const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .upload(file.name, file, { upsert: true });
    // path는 file name으로, option 중 upsert를 사용

    if (error) {
        handleError(error);
    }

    return data;
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

// export async function getFilesFromDB(searchQuery?: string) {
//     const supabase = await createServerSupabaseClient();

//     let query = supabase.from("file").select("*");

//     if (searchQuery) {
//         query = query.ilike("name", `%${searchQuery}%`);
//     }

//     const { data, error } = await query;

//     if (error) {
//         handleError(error);
//     }

//     return data;
// }

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
