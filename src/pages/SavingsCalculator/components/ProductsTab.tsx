import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'entities/savings/api';

export function ProductsTab({
  items,
  isSelected,
  onSelect,
}: {
  items: SavingsProduct[];
  isSelected: (id: string) => boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {items?.map(product => (
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
          right={isSelected(product.id) ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => {
            onSelect(product.id);
          }}
        />
      ))}
    </>
  );
}
