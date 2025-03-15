import { Metadata } from "next";
import Ui from "./Ui";

// 페이지의 메타데이터를 정의
// use client에서는 사용 불가 - 클라이언트 코드는 Ui.tsx에서 정의하는 이유
export const metadata: Metadata = {
    title: "Dropbox Clone",
    description: "A minimalist Dropbox Clone",
};

export default function Home() {
    return <Ui />;
}
