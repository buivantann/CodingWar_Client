import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/Button';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schemaValidation = Yup.object({
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
});

const Login = ({ onChangeRegister, onChangeModal }) => {
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
    mode: 'onChange',
  });
  return (
    <>
      <div className='modal__body'>
        <form onSubmit={handleSubmit(auth.signIn)} autoComplete='off'>
          <div className='modal__body-control'>
            <input {...register('email')} type='text' id='email' placeholder='Email' />
            {errors?.email && (
              <div style={{ color: 'red', fontSize: '13px', padding: ' 3px 6px' }}>
                {errors.email?.message}
              </div>
            )}
          </div>
          <div className='modal__body-control'>
            <input {...register('password')} type='password' id='password' placeholder='Mật khẩu' />
            {errors?.password && (
              <div style={{ color: 'red', fontSize: '13px', padding: ' 3px 6px' }}>
                {errors.password?.message}
              </div>
            )}
          </div>
          <div className='modal__body-submit'>
            <Button size='lg'>
              {auth.loading ? <div className='loading'></div> : 'Đăng nhập'}
            </Button>
          </div>
        </form>
      </div>
      <div className='modal__footer'>
        <div className='modal__footer-login'>
          <div className='modal__footer-link' onClick={() => onChangeRegister(true)}>
            <span>Chưa có tài khoản, Đăng ký!</span>
          </div>
          <div className='modal__footer-link'>
            <span>Quên mật khẩu?</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
