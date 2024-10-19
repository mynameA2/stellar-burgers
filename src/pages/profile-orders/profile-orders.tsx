import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../slices/userOrderSlice';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.userOrders);

  // При монтировании компонента ставим useEffect для получения данных о заказах
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Если данные о заказах не загружены, отображаем прелоадер
  if (isLoading) return <Preloader />;

  // Если есть ошибка, отображаем ее
  if (error) return <div>Ошибка загрузки заказов: {error}</div>;

  // Если данные о заказах загружены, отображаем их
  return <ProfileOrdersUI orders={orders || []} />;
};
