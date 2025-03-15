"use client";

export default function FileDropzone() {
    return (
        <section className="w-full flex flex-col items-center py-20 border-2 border-dashed border-slate-300">
            <input type="file" />
            <div className="flex items-center gap-2">
                <i className="fas fa-cloud-upload-alt text-gray-400"></i>
                <span className="text-gray-400">
                    드래그 앤 드롭으로 파일을 업로드해주세요
                </span>
            </div>
        </section>
    );
}
