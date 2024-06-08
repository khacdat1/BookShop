'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styled.scss';
import ChartPie from '../components/chart/ChartPie';
import TableData from './components/TableData';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    onCheckAdd,
    prevForm,
    saveDescImage,
    saveFirstFormEdit,
    saveMainImage,
} from '@/redux/reducers/formAddReducer';
import LoadingAnt from '@/components/Loading';
import ModalAnt from '@/components/ModalAnt';
import axios from 'axios';
import { getAllbookDeleted, getBookById, searchBook } from '@/services/bookService';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

export default function ProductPage() {
    const checkAdd = useSelector((state) => state.form.checkAdd);
    const [searchTerm, setSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [book, setBook] = useState({});
    const [listBook, setListBook] = useState([]);

    const hanleGetBookById = async (idBook) => {
        const { data } = await getBookById(idBook);
        if (data) {
            setBook(data.book);
        }
    };

    const hanldeGetAllBooks = async () => {
        // const { data } = await axios.get('http://host:3030/api/book');
        const { data } = await getAllbookDeleted();
        setListBook(data);
    };
    const handleSearch = debounce(async (term) => {
        if (term) {
            setIsLoading(true);
            const { data } = await searchBook({ title: term });
            setListBook(data);
        } else {
            setIsLoading(true);
            const { data } = await getAllbookDeleted();
            setListBook(data);
        }
        setIsLoading(false);
    }, 1000);
    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        handleSearch(newSearchTerm);
    };
    return (
        <>
            {!checkAdd ? (
                <div className={`relative ${isLoading ? 'cursor-wait' : ''}`}>
                    <h2 className="font-semibold text-[28px] mb-[10px]">
                        Deleted Products Management
                    </h2>
                    <div className="mb-[20px]">
                        <input
                            type="text"
                            placeholder="Search book..."
                            className={`mt-[10px] w-[40%] p-3 text-sm font-semibold border rounded-md outline-none ${isLoading ? 'cursor-wait' : ''
                                }`}
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <TableData
                        listBook={listBook}
                        hanldeGetAllBooks={hanldeGetAllBooks}
                    ></TableData>
                </div>
            ) : (
                <StepForm></StepForm>
            )}
            <ModalAnt
                book={book}
                hanldeGetAllBooks={hanldeGetAllBooks}
            ></ModalAnt>
        </>
    );
}
