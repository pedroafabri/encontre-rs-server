export type PaginatedResult<T> = {
    results: Array<T>,
    currentPage: number,
    totalPages: number,
    totalPeople: number
}
