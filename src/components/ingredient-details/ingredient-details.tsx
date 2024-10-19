import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  // Получаем id ингредиента
  const params = useParams<{ id: string }>();
  useEffect(() => {
    if (!params.id) {
      navigate('/', { replace: true });
    }
  }, []);

  // Получаем список ингредиентов из стора
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((item) => item._id === params.id);

  // Если ингредиент не найден, отображаем прелоадер
  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
