export const URL = process.env.BURGER_API_URL;

// создаем функцию проверки ответа на `ok`
const checkResponse = async <T>(res: Response): Promise<TServerResponse<T>> =>
  res.ok
    ? res.json()
    : res
        .json()
        .then((err) => Promise.reject(`Ошибка ${res.status}: ${err.message}`)); // не забываем выкидывать ошибку, чтобы она попала в `catch`

type TServerResponse<T> = {
  success: boolean;
} & T;

// создаем функцию проверки на `success`
const checkSuccess = <T>(res: TServerResponse<T>) => {
  if (res.success) {
    return res;
  }
  // не забываем выкидывать ошибку, чтобы она попала в `catch`
  return Promise.reject(`Ответ не success: ${res}`);
};

// создаем универсальную фукнцию запроса с проверкой ответа и `success`
// В вызов приходит `endpoint`(часть урла, которая идет после базового) и опции
export const request = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  // а также в ней базовый урл сразу прописывается, чтобы не дублировать в каждом запросе
  const res = await fetch(`${URL}${endpoint}`, options);
  const data = await checkResponse<TServerResponse<T>>(res);
  return checkSuccess<T>(data);
};
