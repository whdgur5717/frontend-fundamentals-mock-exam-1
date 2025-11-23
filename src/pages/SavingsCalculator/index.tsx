import type { CalculationFormState } from './type';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProuectsQuery, type SavingsProduct } from 'entities/savings/api';
import { useState } from 'react';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { CalculatorForm } from './components/CalculatorForm';

export function SavingsCalculatorPage() {
  const [calculationFormState, setCalculationFormState] = useState<CalculationFormState>({
    targetAmount: '0',
    monthlyAmount: '0',
    availableTerms: '12',
  });

  const selectSavingsProductsByForm = (products: SavingsProduct[]) => {
    const monthly = Number(calculationFormState.monthlyAmount);
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

  // const 예상_수익_금액 =
  //   Number(calculationFormState.monthlyAmount) *
  //   Number(calculationFormState.targetAmount) *
  //   (1 + selectedProduct?.annualRate * 0.5);

  // const 목표_금액과의_차이 = Number(calculationFormState.targetAmount) - 예상_수익_금액;

  // const 추천_월_납입_금액 =
  //   Number(calculationFormState.targetAmount) /
  //   (Number(calculationFormState.availableTerms) * (1 + selectedProduct?.annualRate * 0.5));

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <CalculatorForm calculationFormState={calculationFormState} setCalculationFormState={setCalculationFormState} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Spacing size={40} />

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
