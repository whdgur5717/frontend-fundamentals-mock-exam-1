import { http } from 'tosslib';
import { queryOptions } from '@tanstack/react-query';

/**
 * Savings 상품 타입 정의 (서버 응답 스키마)
 *
 * GET /api/savings-products 응답 예시
 * [
 *   {
 *     id: 'savings-001',
 *     name: '기본 정기적금',
 *     annualRate: 3.2,
 *     minMonthlyAmount: 10000,
 *     maxMonthlyAmount: 500000,
 *     availableTerms: 12,
 *   },
 *   ...
 * ]
 */
export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export type GetSavingsProductsResponse = SavingsProduct[];

const SAVINGS_PRODUCTS_ENDPOINT = '/api/savings-products';

/**
 * 적금 상품 목록 조회 API
 * - 성공 시 SavingsProduct 배열을 반환합니다.
 * - 오류는 호출 측에서 try/catch로 처리하고 `isHttpError`로 분기하세요.
 */
export async function getSavingsProducts(): Promise<GetSavingsProductsResponse> {
  const data = await http.get<GetSavingsProductsResponse>(SAVINGS_PRODUCTS_ENDPOINT);
  return data;
}

export const getSavingsProuectsQuery = queryOptions({
  queryKey: ['savings-products'],
  queryFn: getSavingsProducts,
  staleTime: Infinity,
});
