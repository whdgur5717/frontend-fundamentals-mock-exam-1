import type { CalculationFormState } from './type';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProuectsQuery, type SavingsProduct } from 'entities/savings/api';
import { useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { CalculatorForm } from './components/CalculatorForm';
import { Tabs, TabsContent } from './components/Tabs';

export function SavingsCalculatorPage() {
  const [calculationFormState, setCalculationFormState] = useState<CalculationFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    availableTerms: '12',
  });

  const selectSavingsProductsByForm = (products: SavingsProduct[]) => {
    const monthly = calculationFormState.monthlyAmount;
    const term = Number(calculationFormState.availableTerms);
    return products.filter(
      p => p.minMonthlyAmount < monthly && monthly < p.maxMonthlyAmount && term === p.availableTerms
    );
  };

  const { data: savingsProducts } = useSuspenseQuery({
    ...getSavingsProuectsQuery,
    select: selectSavingsProductsByForm,
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = savingsProducts.find(product => product?.id === selectedProductId);

  //시간부족으로 일단 하드코딩..
  const monthly = calculationFormState.monthlyAmount;
  const term = Number(calculationFormState.availableTerms);
  const targetAmountNum = calculationFormState.targetAmount;
  const annualRate = selectedProduct?.annualRate ?? 0;

  const 예상_수익_금액 = monthly * term * (1 + annualRate * 0.5);
  const 목표_금액과의_차이 = targetAmountNum - 예상_수익_금액;
  const 추천_월_납입_금액 = targetAmountNum / (term * (1 + annualRate * 0.5));

  const roundToUnit = (n: number, unit: number) => Math.round(n / unit) * unit;
  const formatCurrency = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <CalculatorForm calculationFormState={calculationFormState} setCalculationFormState={setCalculationFormState} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tabs defaultValue="products">
        <TabsContent value="products">
          <>
            {savingsProducts?.map(product => (
              <ListRow
                key={product.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={product.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${product.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={''}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                onClick={() => {
                  setSelectedProductId(product.id);
                }}
              />
            ))}
          </>
        </TabsContent>
        <TabsContent value="results">
          <>
            <Spacing size={8} />

            {selectedProduct ? (
              <>
                {[
                  { key: 'final', top: '예상 수익 금액', bottom: formatCurrency(예상_수익_금액) },
                  {
                    key: 'gap',
                    top: '목표 금액과의 차이',
                    bottom: `${목표_금액과의_차이 < 0 ? '-' : ''}${formatCurrency(Math.abs(목표_금액과의_차이))}`,
                  },
                  {
                    key: 'recommend',
                    top: '추천 월 납입 금액',
                    bottom: formatCurrency(roundToUnit(추천_월_납입_금액, 1000)),
                  },
                ].map(row => (
                  <ListRow
                    key={row.key}
                    contents={
                      <ListRow.Texts
                        type="2RowTypeA"
                        top={row.top}
                        topProps={{ color: colors.grey600 }}
                        bottom={row.bottom}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                      />
                    }
                  />
                ))}
              </>
            ) : (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}

            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />

            {[...savingsProducts]
              .sort((a, b) => b.annualRate - a.annualRate)
              .slice(0, 2)
              .map(product => (
                <ListRow
                  key={product.id}
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={product.name}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: ${product.annualRate}%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`${formatCurrency(product.minMonthlyAmount)} ~ ${formatCurrency(
                        product.maxMonthlyAmount
                      )} | ${product.availableTerms}개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                />
              ))}
          </>
        </TabsContent>
      </Tabs>

      <Spacing size={40} />
    </>
  );
}
