import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

// Вспомогательная функция для получения первых 20 заказов
// фильтруем по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // данные из хранилища
  const { orders, total, totalToday } = useSelector(
    (state) => state.ordersData
  );
  // общее количество заказов и заказы за сегодня
  const feed = { total, totalToday };
  // сортируем исполненные
  const readyOrders = getOrders(orders, 'done');
  // сортируем в роботе
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
