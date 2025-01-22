import { Navigate, useLocation } from 'react-router-dom';
import { updateTokens } from '../../slices/authSlice';
import { Preloader } from '../ui/preloader';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
  unAuthenticated?: boolean;
};

export const ProtectedRoute = ({
  children,
  unAuthenticated
}: ProtectedRouteProps) => {
  const { isLoading, user, isAuthenticated } = useSelector(
    (store) => store.auth
  );
  const location = useLocation();
  const dispatch = useDispatch();

  // Проверка, если токен истёк — пробуем обновить токен (по refresh токену).
  useEffect(() => {
    const Token = localStorage.getItem('refreshToken');
    if (!user && Token) {
      dispatch(updateTokens()); // Запрос на обновление токена
    }
  }, [dispatch, user]);

  // Если идёт загрузка данных о пользователе, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }
  // если защищен только для неавторизованных и пользователь авторизован, редиректим на логин
  if (!unAuthenticated && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  // Если страница защищена только для неавторизованных пользователей и пользователь уже авторизован
  if (unAuthenticated && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }
  // если все ок, рендерим
  return children;
};
