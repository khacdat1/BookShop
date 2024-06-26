'use client';

import Link from 'next/link';
import routes from '@/constant/routes';
import Button from '@/components/Button';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../../assets/logo.png';
import InforLogin from '@/components/InforLogin';
import { useTranslation } from 'react-i18next';
import { locales } from '@/components/i18n/i18n';
import Popover from '@/components/Popover';

export default function Header() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentlanguage = locales[i18n.language];
  const pathname = usePathname();
  const [auth, setAuth] = useState(null);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      setAuth(JSON.parse(auth));
    }
  }, []);
  return (
    <header className="flex items-center gap-x-3 px-[100px] bg-white">
      <div className="w-[80px] h-[80px]">
        <Link href={routes.HOME}>
          <Image src={logo} alt="" className="object-cover w-full h-full" />
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <Link
          href={routes.HOME}
          className={
            pathname === routes.HOME
              ? 'text-[#b08fff] font-semibold text-sm'
              : 'text-sm font-semibold'
          }
        >
          {t('Home')}
        </Link>
        <Link
          href={routes.ALLBOOK}
          className={
            pathname === routes.ALLBOOK
              ? 'text-[#b08fff] font-semibold text-sm'
              : 'text-sm font-semibold'
          }
        >
          {t('Books')}
        </Link>
        {/* <Link
          href={auth ? routes.RECOMMEND : '#'}
          className={
            pathname === routes.RECOMMEND
              ? 'text-[#b08fff] font-semibold text-sm'
              : 'text-sm font-semibold'
          }
        >
          {auth && t('Recommend')}
        </Link> */}

      </div>
      <div className="flex ml-auto gap-x-3">
        {auth ? (
          <>
            <Popover
              className="flex items-center px-2 py-1 ml-6 font-medium text-white rounded-lg cursor-pointer hover:text-gray-300 bg-sky-800"
              renderPopover={
                <div className="relative bg-white border border-gray-200 rounded-sm shadow-md">
                  <button
                    className="block w-full px-4 py-3 pr-20 text-left bg-white hover:bg-slate-100 hover:text-red-600"
                    onClick={() => changeLanguage('vi')}
                  >
                    {t('vn')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 text-left bg-white hover:bg-slate-100 hover:text-red-600"
                    onClick={() => changeLanguage('en')}
                  >
                    {t('en')}
                  </button>
                </div>
              }
            >
              {' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span className="mx-1">{currentlanguage}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </Popover>
            <InforLogin />
          </>
        ) : (
          <>
            <Popover
              className="flex items-center px-2 py-1 ml-6 font-medium text-white rounded-lg cursor-pointer hover:text-gray-300 bg-sky-800"
              renderPopover={
                <div className="relative bg-white border border-gray-200 rounded-sm shadow-md">
                  <button
                    className="block w-full px-4 py-3 pr-20 text-left bg-white hover:bg-slate-100 hover:text-red-600"
                    onClick={() => changeLanguage('vi')}
                  >
                    {t('vn')}
                  </button>
                  <button
                    className="block w-full px-4 py-3 text-left bg-white hover:bg-slate-100 hover:text-red-600"
                    onClick={() => changeLanguage('en')}
                  >
                    {t('en')}
                  </button>
                </div>
              }
            >
              {' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span className="mx-1">{currentlanguage}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </Popover>
            <Button kind="primary" to={routes.LOGIN}>
              {t('Login')}
            </Button>
            <Button kind="secondary" to={routes.REGISTER} isBorder={true}>
              {t('Register')}
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
