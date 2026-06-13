import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const token = localStorage.getItem('piknic_token');

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/api/users/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setWishlist(res.data)).catch(err => console.error(err));
        } else {
            setWishlist([]);
        }
    }, [token]);

    const toggleWishlist = async (productId) => {
        if (!token) {
            alert("Sevimlilarga qo'shish uchun tizimga kiring!");
            return;
        }
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/wishlist/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(data);
        } catch (error) {
            console.error(error);
        }
    };

    const isInWishlist = (productId) => wishlist.some(item => item._id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);