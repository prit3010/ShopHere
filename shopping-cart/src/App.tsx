import { useState } from 'react'
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item';
import Header from './Header/Header'
import Cart from './Cart/Cart';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Badge from '@mui/material/Badge';
// Styles
import { Box, StyledButton } from './App.styles';
// Types
export type CartItemType = {
    id: number;
    category: string;
    description: string;
    image: string;
    price: number;
    title: string;
    amount: number;
};
// Async Function to get Data from Fake Store API
const getProducts = async (): Promise<CartItemType[]> =>
    await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[])

    const { data, isLoading, error } = useQuery<CartItemType[]>(
        'products',
        getProducts
    );
    console.log(data);

    const getTotalItems = (allItems: CartItemType[]) =>
        allItems.reduce((ack: number, item) => ack + item.amount, 0);

    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems(prevState => {
            // Check if the item already added in the cart
            const isItemInCart = prevState.find(item => item.id === clickedItem.id);

            // If it is, add to the amount
            if (isItemInCart) {
                return prevState.map(item =>
                    item.id === clickedItem.id
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }
            // First time the item is added
            return [...prevState, { ...clickedItem, amount: 1 }];
        });
    };

    const handleRemoveFromCart = (id: number) => {
        /* Goes through the array to check if id matches and 
        if it does, minus 1 from amount */
        setCartItems(prevState =>
            prevState.reduce((ack, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return ack;
                    return [...ack, { ...item, amount: item.amount - 1 }];
                } else {
                    return [...ack, item];
                }
            }, [] as CartItemType[])
        );
    };

    if (isLoading) return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Stack alignItems="center">
                <CircularProgress />;
            </Stack>
        </div>

    )
    if (error) return <div>Error. Please Try Again</div>;

    return (

        <Box>
            <Header />
            <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
                <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                />
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)} >
                <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                    <AddShoppingCartIcon />
                </Badge>
            </StyledButton>
            <Grid container spacing={3}>
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default App;

