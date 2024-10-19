import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';
import { request, URL } from './request';

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

// Запрос на обновление токенов
export const refreshToken = async (): Promise<TRefreshResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return Promise.reject('Refresh token is missing');
  }

  // Используем универсальную функцию `request`
  const refreshData = await request<TRefreshResponse>(`/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: refreshToken
    })
  });

  // Проверяем успешность запроса
  if (!refreshData.success) {
    return Promise.reject(refreshData);
  }

  // Сохраняем новые токены
  localStorage.setItem('refreshToken', refreshData.refreshToken);
  setCookie('accessToken', refreshData.accessToken);

  return refreshData;
};

// Запрос с обновленным токеном
export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    // Выполняем первоначальный запрос через универсальную функцию request
    return await request<T>(endpoint, options);
  } catch (err) {
    // Проверяем, если ошибка связана с истекшим JWT
    if ((err as { message: string }).message === 'jwt expired') {
      // Обновляем токен
      const refreshData = await refreshToken();

      // Обновляем заголовок авторизации с новым токеном
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      } else {
        options.headers = {
          authorization: refreshData.accessToken
        };
      }

      // Повторяем запрос с обновленным токеном через request
      return await request<T>(endpoint, options);
    } else {
      // Если ошибка не связана с токеном, передаем её дальше
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;
// запрос на получение списка ингредиентов
export const getIngredientsApi = () =>
  request<TIngredientsResponse>('/ingredients').then((data) => data.data);

// запрос на получение всех заказов отображенаемых в ленте
export const getFeedsApi = () =>
  request<TFeedsResponse>('/orders/all').then((data) => data);

// запрос на получение заказов профиля с сервера
export const getOrdersApi = () =>
  request<TFeedsResponse>('/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => data.orders);

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

// запрос на создание нового заказа
export const orderBurgerApi = (data: string[]) =>
  request<TNewOrderResponse>(`/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => data);

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;
// запрос на получение заказа по номеру
export const getOrderByNumberApi = (number: number) =>
  request<TOrderResponse>(`/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    } as HeadersInit
  }).then((data) => data);

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

// запрос на регистрацию пользователя
export const registerUserApi = (data: TRegisterData) =>
  request<TAuthResponse>(`/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    } as HeadersInit,
    body: JSON.stringify(data)
  }).then((data) => data);

export type TLoginData = {
  email: string;
  password: string;
};
// запрос на авторизацию пользователя
export const loginUserApi = (data: TLoginData) =>
  request<TAuthResponse>(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then((data) => data);

// запрос на востановление пароля
export const forgotPasswordApi = (data: { email: string }) =>
  request<TServerResponse<{}>>(`/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then((data) => data);

// запрос на сброс пароля

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request<TServerResponse<{}>>(`/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then((data) => data);

type TUserResponse = TServerResponse<{ user: TUser }>;

// запрос на обновление данных пользователя по токену
export const getUserApi = () =>
  request<TUserResponse>(`/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

// запрос на обновление данных пользователя
export const updateUserApi = (user: Partial<TRegisterData>) =>
  request<TUserResponse>(`/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

// запрос на выход из профиля
export const logoutApi = (token: string) =>
  request<TServerResponse<{}>>(`/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: token
    })
  });
