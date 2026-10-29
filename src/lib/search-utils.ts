/**
 * Tiện ích chuẩn hóa và tìm kiếm thông minh hỗ trợ tiếng Việt có dấu/không dấu,
 * tách từ khóa (multi-token search), và loại bỏ ký tự đặc biệt / dấu gạch ngang (Mã PIN).
 */

/**
 * Chuẩn hóa chuỗi tiếng Việt: Bỏ dấu, chuyển chữ thường, loại bỏ khoảng trắng thừa
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/y/g, "i")
    .trim();
}

/**
 * Kiểm tra xem `sourceText` có khớp với `query` hay không bằng thuật toán Multi-Token Matching.
 * Ví dụ: Query "toán 12" vẫn tìm thấy "Đề thi lớp 12 môn Toán học" (không bắt buộc 2 từ phải đứng cạnh nhau).
 */
export function matchSmartSearch(sourceText: string, query: string): boolean {
  if (!query) return true;
  if (!sourceText) return false;

  const normSource = normalizeSearchText(sourceText);
  const normQuery = normalizeSearchText(query);

  if (!normQuery) return true;

  // 1. Khớp chính xác toàn bộ chuỗi tìm kiếm
  if (normSource.includes(normQuery)) return true;

  // 2. So khớp không tính dấu gạch ngang (Phục vụ tìm Mã đề, Mã thẻ: EDM-8899 <-> EDM8899)
  const cleanSource = normSource.replace(/[-_.\s]/g, "");
  const cleanQuery = normQuery.replace(/[-_.\s]/g, "");
  if (cleanQuery && cleanSource.includes(cleanQuery)) return true;

  // 3. Multi-token (AND logic): Tách query thành các từ đơn lẻ, tất cả các từ đều phải xuất hiện trong source
  const tokens = normQuery.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length > 1) {
    const allTokensMatch = tokens.every((token) => normSource.includes(token));
    if (allTokensMatch) return true;
  }

  return false;
}
