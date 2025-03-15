"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "types_db";

// 서버에서 사용할 수퍼베이스 클라이언트, admin 여부를 props로 받음
export const createServerSupabaseClient = async (
    cookieStore: ReturnType<typeof cookies> = cookies(),
    admin: boolean = false
) => {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // 관리자 권한으로 실행할지 여부를 판단, 그에 맞는 키를 사용
        admin
            ? process.env.NEXT_SUPABASE_SERVICE_ROLE!
            : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
};

// admin true, 관리자 권한으로 실행하는 수퍼베이스 서버 클라이언트
export const createServerSupabaseAdminClient = async (
    cookieStore: ReturnType<typeof cookies> = cookies()
) => {
    return createServerSupabaseClient(cookieStore, true);
};
