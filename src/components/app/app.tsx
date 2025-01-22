import { ConstructorPage } from '@pages';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import {
  setTokens,
  setUser,
  startLoading,
  stopLoading
} from '../../slices/authSlice';
import { fetchIngredients } from '../../slices/IngredientsSlice';
import { Location, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getCookie, deleteCookie } from '../../utils/cookie';
import { useDispatch, useSelector } from '../../services/store';
import { getUserApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader/preloader';

const App = () => <MainApp />;
// Вынесем логику работы с роутами и модалками в отдельный компонент
const MainApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);
  const backgroundLocation = location.state?.background || null;
  const closeModal = () => {
    navigate(-1); // возвращаемся назад
  };

  // ставим useEffect для получения ингредиентов и проверки токенов
  useEffect(() => {
    // Запускаем загрузку
    dispatch(startLoading());
    // Запускаем загрузку ингредиентов
    dispatch(fetchIngredients());

    // Достаем актуальные токены которые есть в localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    // Если есть записанные в localStorage токены,
    if (refreshToken || accessToken) {
      dispatch(
        setTokens({
          accessToken: accessToken || '',
          refreshToken: refreshToken || ''
        })
      );
      //то получаем токены и данные пользователя с сервера
      getUserApi()
        .then((res) => {
          dispatch(setUser(res.user));
        })
        .catch((err) => {
          console.error('Ошибка:', err);
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    } else {
      dispatch(stopLoading());
    }
  }, [dispatch]);
  // Если данные о заказах не загружены, отображаем прелоадер
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        {/* Открытые маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищенные маршруты */}
        <Route
          path='/login'
          element={<ProtectedRoute unAuthenticated>{<Login />}</ProtectedRoute>}
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthenticated>{<Register />}</ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthenticated>
              {<ForgotPassword />}
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthenticated>{<ResetPassword />}</ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute unAuthenticated>{<Profile />}</ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute unAuthenticated>{<ProfileOrders />}</ProtectedRoute>
          }
        />

        {/* Роут для страницы 404 */}
        <Route path='*' element={<NotFound404 />} />

        {/* Роуты для полного отображения компонентов */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute unAuthenticated>{<OrderInfo />}</ProtectedRoute>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Описание ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Заказ'} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Заказ'} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
