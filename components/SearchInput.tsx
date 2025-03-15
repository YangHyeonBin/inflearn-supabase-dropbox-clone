export default function SearchInput({
    searchInput,
    setSearchInput,
}: {
    searchInput: string;
    setSearchInput: (searchInput: string) => void;
}) {
    return (
        <div className="relative">
            <input
                type="text"
                value={searchInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(e.target.value)
                }
                placeholder="파일명을 입력해주세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
            </div>
        </div>
    );
}
