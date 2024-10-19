import { FC, SyntheticEvent, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { LoginUI } from '@ui-pages';
import { setTokens, setUser } from '../../slices/authSlice';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '@api';

export const Login: FC = () => {
  const { values, handleChange, setValues } = useForm({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await loginUserApi({
        email: values.email,
        password: values.password
      });

      // Сохраняем токены и данные пользователя в Redux
      const { accessToken, refreshToken, user } = response;
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setUser(user));

      // Сохранение токенов в cookies и localStorage с улучшенной безопасностью
      setCookie('accessToken', accessToken, {
        path: '/', // доступен на всех маршрутах
        secure: true, // только для HTTPS
        httpOnly: true, // защита от клиентских скриптов
        sameSite: 'Strict' // предотвращение кросс-сайтовой передачи
      });
      localStorage.setItem('refreshToken', refreshToken);

      // Перенаправление на защищенный маршрут профиля
      navigate('/profile', { replace: true });
    } catch (error) {
      setErrorText(
        'Ошибка входа. Пожалуйста, проверьте ваши данные и попробуйте снова.'
      );
      console.error('Login error:', error);
    }
  };
  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={handleChange}
      password={values.password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
