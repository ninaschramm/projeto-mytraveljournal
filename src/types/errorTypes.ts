export type AppErrorTypes = "conflict" | "not_found" | "unauthorized" | "wrong_schema" | "bad_request" ;

export interface AppError {
  type: AppErrorTypes;
  message: string;
}
