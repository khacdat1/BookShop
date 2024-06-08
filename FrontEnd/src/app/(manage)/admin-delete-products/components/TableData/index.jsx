'use client';
import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, message } from 'antd';
import './styled.scss';
import axios from 'axios';
import { restoreBook, getAllbookDeleted } from '@/services/bookService';
import Link from 'next/link';
import LoadingPage from '@/components/LoadingPage';

const TableData = ({ listBook, hanldeGetAllBooks }) => {
  const columns = [
    {
      title: 'Title',
      width: 20,
      dataIndex: 'booktitle',
      key: 'booktitle',
    },
    {
      title: 'Price',
      width: 10,
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 15,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 10,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 10,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 10,
    },
    {
      title: 'Action',
      key: 'action',
      width: 10,
      render: (text, record) => (
        <div className="flex items-center gap-x-[10px] ">
          <Popconfirm
            title="Are you sure to restore this record?"
            onConfirm={() => handleRestore(record._id)}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" size="small" className="p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7 21q-.825 0-1.413-.588T5 19V6q-.425 0-.713-.288T4 5q0-.425.288-.713T5 4h4q0-.425.288-.713T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"
                />
              </svg>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleRestore = async (rowId) => {
    const result = await restoreBook(rowId);
    console.log('file: index.jsx:117 ~ handleDelete ~ result:', result);
    // const updatedData = data.filter((row) => row._id !== rowId);
    // setData(updatedData);
    hanldeGetAllBooks();
    message.success('Record deleted successfully');
  };
  useEffect(() => {
    try {
      setIsLoading(false);
      hanldeGetAllBooks();
    } catch (error) {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (listBook?.length >= 0) {
      setData(listBook);
    }
  }, [listBook]);

  return (
    <div className="max-h-[500px]">
      {isLoading ? (
        <div className="mx-auto mt-10 w-max">
          <LoadingPage></LoadingPage>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          className="max-h-[500px]"
          pagination={{
            showSizeChanger: true, // Hiển thị tùy chọn lựa chọn pageSize
            pageSizeOptions: ['4', '8', '12'], // Các tùy chọn pageSize
            defaultPageSize: 4, // Kích thước mặc định của pageSize
          }}
          scroll={{
            x: 800,
            y: 275,
          }}
        />
      )}
    </div>
  );
};
export default TableData;
