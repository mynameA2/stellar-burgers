import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useDrag } from 'react-dnd'; // Импортируем хук для создания источника перетаскивания
import { addIngredient } from '../../slices/constructorItemsSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    // Используем useDrag для того, чтобы сделать компонент перетаскиваемым
    // const [{ isDragging }, dragRef] = useDrag({
    //   type: 'ingredient', // Тип для DnD системы
    //   item: { ingredient }, // Данные, которые будут переданы при перетаскивании
    //   collect: (monitor) => ({
    //     isDragging: monitor.isDragging()
    //   })
    // });

    return (
      // <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div>
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          locationState={{ background: location }}
          handleAdd={handleAdd}
        />
      </div>
    );
  }
);
