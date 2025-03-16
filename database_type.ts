import { Database } from "types_db";

export type FileData = Database["public"]["Tables"]["file"]["Row"];
export type FileDataInput = Database["public"]["Tables"]["file"]["Insert"];
