import { Tab } from 'tosslib';
import { Children, isValidElement, useState, type ComponentProps } from 'react';

type TabValue = 'products' | 'results';

export function Tabs({
  children,
  defaultValue = 'products',
}: {
  children: Array<React.ReactElement<{ value: TabValue }>> | React.ReactElement<{ value: TabValue }>;
  defaultValue?: TabValue;
}) {
  const [activeTab, setActiveTab] = useState<TabValue>(defaultValue);
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<ComponentProps<typeof TabsContent>> =>
      isValidElement(child) && child.type === TabsContent
  );
  const activeContent = items.find(child => child.props.value === activeTab) ?? null;
  //Tab.Content를간단하게제작한 버전
  return (
    <>
      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'} onClick={() => setActiveTab('results')}>
          계산 결과
        </Tab.Item>
      </Tab>
      {activeContent}
    </>
  );
}

export function TabsContent({ children }: { value: TabValue; children: React.ReactNode }) {
  return <>{children}</>;
}
