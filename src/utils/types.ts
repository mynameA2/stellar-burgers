// Уникальный ингредиент, используется для отслеживания каждой уникальной копии ингредиента в конструкторе
export type TIngredientUnique = TIngredient & {
  id: string; // Уникальный идентификатор экземпляра ингредиента
};

// Тип для элементов конструктора, массив ингредиентов с уникальными id
export type TConstructorItems = {
  bun: TIngredient | null; // Булка может отсутствовать
  ingredients: TIngredientUnique[]; // Массив уникальных ингредиентов
};

// Тип для ингредиентов
export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

// Тип для конструктора
export type TConstructorIngredient = TIngredient & {
  id: string;
};

// Тип для заказа
export type TOrder = {
  _id: string; // Уникальный идентификатор заказа
  status: 'pending' | 'done' | 'cancelled'; // Статус заказа
  name: string; // Название заказа
  createdAt: string; // Дата создания заказа
  updatedAt: string; // Дата последнего обновления заказа
  number: number; // Номер заказа
  ingredients: string[]; // Массив идентификаторов ингредиентов
};

// Тип для заказов
export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean; // Состояние загрузки
  errorText: string | null; // Текст ошибки, если есть
};

// Тип для пользователя
export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
