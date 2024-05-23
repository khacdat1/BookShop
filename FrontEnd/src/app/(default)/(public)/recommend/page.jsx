'use client';
import { getAllBookWithPagination, searchPageBook } from '@/services/bookService';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingPage from '@/components/LoadingPage';
import BookCard from '@/components/BookCard';
import ReactPaginate from 'react-paginate';
import '../../../../styles/Pagination.scss';
import { Dropdown } from 'antd';

const LIMIT_BOOK_PER_PAGE = 15;
const RecommendPage = () => {
    const { t } = useTranslation('');
    const [isLoading, setIsLoading] = useState(false);
    const [listBook, setListBook] = useState([]);
    const [pageCount, setPageCount] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleGetAllBook = async (page) => {
        setIsLoading(true);
        const res = await getAllBookWithPagination(page, LIMIT_BOOK_PER_PAGE);
        if (res?.data) {
            setListBook(res?.data?.books);
            setPageCount(res?.data?.totalPages);
            setIsLoading(false);
        }
    };
    const handleSearch = debounce(async (term, page) => {
        if (term) {
            setIsLoading(true);
            const res = await searchPageBook(page, LIMIT_BOOK_PER_PAGE, {
                title: term,
            });
            let pageCount = Math.floor(listBook.length / 15);
            setListBook(res?.result?.book);
            if (pageCount === 0) {
                pageCount = 1;
                setPageCount(pageCount);
            } else {
                setPageCount(pageCount);
            }
        }
        else {
            setIsLoading(true);
            const res = await getAllBookWithPagination(page, LIMIT_BOOK_PER_PAGE);
            if (res?.data) {
                setListBook(res?.data?.books);
                setPageCount(res?.data?.totalPages);
                setIsLoading(false);
            }
        }
        setIsLoading(false);
    }, 1000);
    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        handleSearch(newSearchTerm);
    }
    const handlePageClick = (event) => {
        handleGetAllBook(Number(event.selected + 1));
        setCurrentPage(Number(event.selected + 1));
    };
    useEffect(() => {
        handleGetAllBook();
    }, []);
    return (
        <div className="mt-5 wrapper leading-3">
            <div className="mx-auto mt-5 mb-5 w-max text-4xl">
                <h1>Book Recommender System</h1>
            </div>
            <div className='ml-2 mb-5'>Type or select a book from the dropdown</div>
            <div className="w-full p-3 text-sm font-semibold rounded-md outline-none mx-auto">

                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center w-1/2" type="button">Dropdown button <svg class="w-2.5 h-2.5 ms-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
                </button>

                <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                        </li>
                    </ul>
                </div>


            </div>
            {/* <> */}
            {/* <input
                    type="text"
                    placeholder={t('search')}
                    className="w-full p-3 text-sm font-semibold rounded-md outline-none"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </> */}
            {/* {isLoading ? (
                <div className="mx-auto mt-5 w-max">
                    <LoadingPage></LoadingPage>
                </div>
            ) : (
                <div className="flex flex-wrap gap-5 mt-5">
                    {listBook?.length > 0 &&
                        listBook.map((book) => (
                            <BookCard key={book._id} data={book}></BookCard>
                        ))}
                </div>
            )}
            <div className="mx-auto mt-5 w-max">
                {!isLoading && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        className="pagination"
                        forcePage={currentPage - 1}
                    />
                )}
            </div> */}
        </div>
    );
};

export default RecommendPage;