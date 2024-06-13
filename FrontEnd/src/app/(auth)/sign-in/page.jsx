'use client';

import routes from '@/constant/routes';
import Link from 'next/link';
import Label from '@/components/Label';
import InputTogglePassword from '@/components/InputTogglePassword';
import Input from '@/components/Input';
import Field from '@/components/Field';
import ButtonForm from '@/components/ButtonForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { postSignIn } from '@/services/authService';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import '../../../styles/Form.scss';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter valid email address')
      .required('Please enter your email address'),
    password: yup
      .string()
      .min(6, 'Your password must be at least 6 characters or greater')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Your password must have at least 1 uppercase, 1 lowercase, 1 special character',
        }
      )
      .required('Please enter your password'),
  })
  .required();

export default function SignInPage() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const handleSignIn = async (values) => {
    const res = await postSignIn(values.email, values.password);

    if (res?.user?.roleID) {
      if (res?.user?.roleID === '1') {
        const userWithoutRoleID = { ...res };
        delete userWithoutRoleID?.user?.roleID;
        toast.success(res.message);
        router.push(routes.DASHBOARD);
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('auth', JSON.stringify(userWithoutRoleID));
      } else if (res?.user?.roleID === '3') {
        const userWithoutRoleID = { ...res };
        delete userWithoutRoleID?.user?.roleID;
        toast.success(res.message);
        router.push(routes.HOME);
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('auth', JSON.stringify(userWithoutRoleID));
      }
    } else if (res?.response?.status === 500) {
      toast.error(res?.response?.message);
    } else if (res?.response?.status === 500) {
      toast.error(res?.response?.message);
    }
  };
  return (
    // <div className="form-wrapper flex items-center justify-center px-[20px]">
    //   <form
    //     className="w-[500px] mx-auto bg-[#eee] rounded-lg p-8 bg-opacity-60"
    //     onSubmit={handleSubmit(handleSignIn)}
    //   >
    //     <h1 className="mb-3 text-3xl font-bold">LOGIN</h1>
    //     <Field>
    //       <div className="mb-2">
    //         <Label htmlFor="email">Email address</Label>
    //       </div>
    //       <Input
    //         type="email"
    //         name="email"
    //         control={control}
    //         id="email"
    //         placeholder="Enter your email address"
    //       />
    //       <p className="font-semibold text-xs text-red-700 h-[20px] py-1">
    //         {errors.email && errors.email.message}
    //       </p>
    //     </Field>
    //     <>
    //       <InputTogglePassword name="password" control={control} />
    //       <p className="text-xs font-semibold text-red-700 h-[20px]  py-1 whitespace-break-spaces">
    //         {errors?.password && errors.password.message}
    //       </p>
    //     </>
    //     <Link
    //       href={routes.FORGOTTEN}
    //       className="flex justify-end text-xs font-semibold transition-all -translate-y-[2px] hover:opacity-70"
    //     >
    //       Bạn đã quên mật khẩu?
    //     </Link>
    //     <div className="mx-auto mt-2 w-max">
    //       <ButtonForm>Login</ButtonForm>
    //     </div>
    //     <div className="text-center mt-[10px]">
    //       <span className="font-medium">Do not have an account? </span>
    //       <Link href={routes.REGISTER} className="font-bold">
    //         Sign Up
    //       </Link>
    //     </div>
    //     <div className="mx-auto mt-1 w-max">
    //       <Link
    //         href={routes.HOME}
    //         className="flex items-center text-sm font-semibold gap-x-1"
    //       >
    //         <HiArrowNarrowLeft />
    //         Back to home
    //       </Link>
    //     </div>
    //   </form>
    // </div>
    <div className="form-wrapper flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-blue-500 p-6">
      <form
        className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 backdrop-blur-md bg-opacity-50"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <h1 className="mb-6 text-4xl font-bold text-center text-gray-800">Login</h1>
        <Field>
          <div className="mb-4">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email address
            </Label>
            <Input
              type="email"
              name="email"
              control={control}
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
              placeholder="Enter your email address"
            />
            <p className="text-xs font-semibold text-red-600 mt-1">
              {errors.email && errors.email.message}
            </p>
          </div>
        </Field>
        <Field className="mt-4">
          <InputTogglePassword
            name="password"
            control={control}
            id="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
            placeholder="Enter your password"
          />
          <p className="text-xs font-semibold text-red-600 mt-1">
            {errors.password && errors.password.message}
          </p>
          <Link
            href={routes.FORGOTTEN}
            className="text-xs text-green-600 hover:underline text-right mt-2 block font-semibold"
          >
            Forgot Password?
          </Link>
        </Field>
        <div className="mt-6">
          <ButtonForm
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            Login
          </ButtonForm>
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-700">Don't have an account? </span>
          <Link href={routes.REGISTER} className="text-sm text-green-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link
            href={routes.HOME}
            className="flex items-center justify-center text-gray-600 hover:text-green-600"
          >
            <HiArrowNarrowLeft className="mr-1" />
            Back to home
          </Link>
        </div>
      </form>
    </div>

  );
}
