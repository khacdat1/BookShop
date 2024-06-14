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

                <path d="M 2 2 L 4.9394531 4.9394531 C 3.1262684 6.7482143 2 9.2427079 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 6.486 17.514 2 12 2 L 12 4 C 16.411 4 20 7.589 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 9.7940092 4.9004767 7.7972757 6.3496094 6.3496094 L 9 9 L 9 2 L 2 2 z"></path>
              </svg>

            </Button>
          </Popconfirm>
        </div >
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
