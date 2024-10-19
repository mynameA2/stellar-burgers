import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../slices/ordersSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, errorText } = useSelector(
    (state) => state.ordersData
  );

  // При монтировании компонента ставим useEffect для получения данных о заказах
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Если данные о заказах не загружены, отображаем прелоадер
  if (isLoading) return <Preloader />;

  // Если есть ошибка, отображаем ее
  if (errorText) return <div>Ошибка загрузки заказов: {errorText}</div>;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
