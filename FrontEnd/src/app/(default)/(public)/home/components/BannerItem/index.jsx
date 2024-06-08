import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const BannerItem = ({ book }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-[600px] relative">
      <div className="absolute inset-0 bg-black rounded-md bg-opacity-40"></div>
      {book?.mainImage?.length > 0 &&
        book?.mainImage
          ?.slice(0, 1)
          .map((b, index) => (
            <img
              key={index}
              src={b?.url}
              alt=""
              className="mx-auto object-cover h-full max-w-[400px] p-4 bg-white rounded-md shadow-lg"
            />
          ))}
      <div className="absolute bottom-16 left-10 text-white w-[400px] p-6 bg-black bg-opacity-50 rounded-lg shadow-lg flex flex-col gap-y-4 justify-center">
        <h2 className="text-2xl font-bold">
          {t('Booktitle')}: {book?.booktitle}
        </h2>
        <span className="inline-block text-lg font-medium">
          {t('Category')}: {book?.category}
        </span>
        <p className="mb-4 text-base font-light leading-6">
          {t('Description')}: {book?.desc}
        </p>
        <Link
          href={`/product/${book?._id}`}
          className="bg-[#6d4eec] w-max p-[10px] font-semibold text-base rounded-md hover:bg-opacity-60 transition-all"
        >
          {t('Details')}
        </Link>
      </div>
    </div>
  );
};

export default BannerItem;
