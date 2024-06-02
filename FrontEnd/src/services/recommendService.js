import instance from '../utils/axiosCustomize';
const getBookRecommendById = (id) => {
    return instance.get('/recommend/${id}');
};
const postBookRecommend = (data) => {
    return instance.post('/add-rating', data);
};
export {
    getBookRecommendById,
    postBookRecommend
};
