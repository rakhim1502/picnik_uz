import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('piknic_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('piknic_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product) => {
        setCartItems(prev => {
            const existItem = prev.find(x => x._id === product._id);
            if (existItem) {
                return prev.map(x => x._id === product._id ? { ...existItem, qty: existItem.qty + 1 } : x);
            } else {
                return [...prev, { ...product, qty: 1 }];
            }
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(x => x._id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    }, [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice
    }), [cartItems, addToCart, removeFromCart, clearCart, totalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Hook ni alohida faylga ajratish o'rniga, shu faylda qoldiramiz
// lekin eslint qoidasini o'chirish uchun comment qo'shamiz
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext);
}