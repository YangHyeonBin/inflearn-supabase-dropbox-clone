"use client";

import { useRef } from "react";
import { useUploadFileMutation } from "services/useFileQueries";

export default function FileDropzone() {
    const fileRef = useRef<HTMLInputElement>(null); // 파일 업로드 인풋 ref, 이걸로 접근 가능
    const updateFile = useUploadFileMutation();

    return (
        <form
            className="w-full flex flex-col items-center py-20 border-2 border-dashed border-slate-300"
            onSubmit={async (e) => {
                // 예상치 못한 form 태그의 자체 동작(새로고침 등) 방지
                e.preventDefault();

                const file = fileRef.current?.files?.[0]; // document.querySelector 등을 사용하지 않아도 ref로 요소 특정 가능
                // console.log(file); // 어떤 형태인지 확인

                if (file) {
                    const formData = new FormData();
                    formData.append("file", file); // 'file'이라는 키로 파일을 추가

                    // const result = await uploadFile(formData);
                    updateFile.mutate(formData);
                }
            }}>
            <input type="file" ref={fileRef} />
            <div className="flex items-center gap-2">
                <i className="fas fa-cloud-upload-alt text-gray-400"></i>
                <span className="text-gray-400">
                    드래그 앤 드롭으로 파일을 업로드해주세요
                </span>
            </div>
            <button
                type="submit" // 제출용이므로 명시
                disabled={updateFile.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                {updateFile.isPending ? (
                    <i className="fas fa-spinner animate-spin"></i>
                ) : (
                    "파일 선택"
                )}
            </button>
        </form>
    );
}
