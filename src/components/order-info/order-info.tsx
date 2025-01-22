import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../slices/ordersSlice';

/* Отображаем только данные для текущего заказа */
export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  // Получаем orderId из URL
  const params = useParams<{ number: string }>();
  const number = params.number!;

  // Записываем данные о заказе в переменную
  const orders = useSelector((state) => state.ordersData.orders);
  const orderData = orders.find(
    (item) => item.number === parseInt(params.number!)
  );

  // Записываем список ингредиентов в переменную
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  // Записываем состояние загрузки в переменную
  const isLoading = useSelector((state) => state.order.isLoading);

  // Записываем состояние ошибки в переменную
  const error = useSelector((state) => state.order.errorText);

  // Загружаем данные о заказе при их отсутствии
  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderById(number));
    }
  }, [dispatch, orderData, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    /* Собираем данные по ингредиентам */
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    /* Считаем общую стоимость */
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
