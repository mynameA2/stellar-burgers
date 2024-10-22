import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearOrder, sendOrder } from '../../slices/ordersSlice';
import {
  clearConstructor,
  setOrderRequest
} from '../../slices/constructorItemsSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // извлекаем состояние из стора (ингредиенты и булка)
  const { bun, ingredients, orderRequest } = useSelector(
    (state) => state.constructorItems
  );
  const { order, isLoadingSingleOrder } = useSelector((state) => state.order); // используем новое состояние для заказа
  const { isAuthenticated } = useSelector((state) => state.auth);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = async () => {
    // если нет булки или заказ уже отправляется, то ничего не делаем
    if (!constructorItems.bun || isLoadingSingleOrder) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // создаем массив ингредиентов, состоящий из верхней, нижней булки и ингредиентов для отправки на сервер
    const orderIngredients = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map(
        (ingredient: { _id: any }) => ingredient._id
      ),
      constructorItems.bun?._id
    ];

    // устанавливаем состояние загрузки в конструкторе
    dispatch(setOrderRequest(true));

    // отправляем заказ на сервер
    try {
      const response = await dispatch(sendOrder(orderIngredients)).unwrap(); // отправляем заказ и распаковываем результат

      // очищаем конструктор после успешной отправки заказа
      dispatch(clearConstructor());

      // закрываем модальное окно через 5 секунд
      setTimeout(() => {
        closeOrderModal();
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
    } finally {
      // снимаем состояние загрузки
      dispatch(setOrderRequest(false));
    }
  };

  // Закрытие модального окна
  const closeOrderModal = () => {
    dispatch(clearOrder()); // сбросить данные заказа
  };

  // Подсчет общей стоимости
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price} // подсчет общей стоимости нужно исправить
      orderRequest={isLoadingSingleOrder || orderRequest} // используем флаг загрузки из обоих состояний
      constructorItems={constructorItems}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
