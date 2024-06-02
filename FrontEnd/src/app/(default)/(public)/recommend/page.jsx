'use client';
import { getAllBookWithPagination, searchPageBook } from '@/services/bookService';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccountById } from '@/services/authService';
import ReactPaginate from 'react-paginate';
import LoadingPage from '@/components/LoadingPage';
import BookCard from '@/components/BookCard';
import '../../../../styles/Pagination.scss';
import {
    getBookRecommendById
} from '@/services/bookService';
const LIMIT_BOOK_PER_PAGE = 15;

const RecommendPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listBook, setListBook] = useState([]);
    const [listIdBook, setListIdBook] = useState([]);
    useEffect(() => {
        const getBookRecommendById = async (id) => {
            setIsLoading(true);
            try {
                const result = await axios.get(`http://127.0.0.1:5000/recommend?id=${id}`);
                setListIdBook(result.data);
            } catch (error) {
                console.error('Error fetching book recommendation:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchUserAndRecommend = async () => {
            const auth = JSON.parse(sessionStorage.getItem('auth'));
            if (auth && auth.user && auth.user._id) {
                const user = await getAccountById(auth.user._id);
                if (user && user.user && user.user.id) {
                    getBookRecommendById(user.user.id);
                } else {
                    console.error('User ID not found');
                }
            } else {
                console.error('Auth user ID not found');
            }
        };
        fetchUserAndRecommend();
    }, []);
    useEffect(() => {
        const handleGetBook = async () => {
            Promise.all(listIdBook.map(async (id) => {
                const book = await getBookRecommendById(id);
                setListBook((prev) => [...prev, book.data.book]);
            }));
        }
        handleGetBook();
    }, [listIdBook]);
    console.log("listBook", listBook);
    return (
        <div className="mt-5 wrapper-content">
            {isLoading ? (
                <div className="mx-auto mt-5 w-max">
                    <LoadingPage></LoadingPage>
                </div>
            ) : (
                <div className="flex flex-wrap gap-5 mt-5">
                    {listBook?.length > 0 &&
                        listBook.map((book) => (
                            <BookCard key={book.id} data={book}></BookCard>
                        ))}
                </div>
            )}
        </div>
    );
};

export default RecommendPage;