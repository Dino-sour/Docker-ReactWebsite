// Menu.jsx
import React, {useState, useEffect} from "react";
import MenuItem from "./MenuItem";
import "./Menu.css";

const Menu = () => {
    const[appetizerItems, setAppetizerItems] = useState([]);
    const[burgerSandwichItems, setBurgerSandwichItems] = useState([]);
    const[breakfastItems, setBreakfastItems] = useState([]);
    const[saladItems, setSaladItems] = useState([]);
    const[error, setError] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        console.log('Updated appetizerItems:', appetizerItems);
    }, [appetizerItems]);

    const fetchItems = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/menu');
            if(!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();

            console.log('data:', data);

            const groupedItems = data.reduce((acc, item) => {
                if(!acc[item.type]){
                    acc[item.type] = [];
                }
                acc[item.type].push(item);
                return acc;
            }, {});

            setAppetizerItems(groupedItems.Appetizers || []);
            setBurgerSandwichItems(groupedItems.BurgersAndSandwiches || []);
            setBreakfastItems(groupedItems.AllDayBreakfast || []);
            setSaladItems(groupedItems.Salads || []);            


        }
        catch(err){
            setError(err.message);
            console.error('Error fetching items: ', err);
        }
    };

    if(error){
        return(
            <div className="menu-page">
                <h1 className="menu-title">Error loading menu items.</h1>
                <p>{error}</p>
            </div>
        );
    }

    return(
        <div className="menu-page">
            <div className="title-container">
                <h1 className="menu-title">Menu</h1>
                <p className="regular">Explore our delicious choices in  appetizers, sandwiches, and all day breakfast.</p>
                <p className="bold">Kitchen open daily from 11 AM - 11 PM</p>
            </div>
            <div className="category-container">
                <h2 className="menu-category">APPETIZERS</h2>
                <div className="menu-appetizers">
                    {appetizerItems.map((item) => (
                        <MenuItem key={item.item_id} item={item} />
                    ))}
                    
                </div>
            </div>
            <div className="category-container">
                <h2 className="menu-category">BURGERS AND SANDWICHES</h2>
                <div className="menu-items">
                    <div className="menu-burgers-sandwiches">
                        {burgerSandwichItems.map((item) => (
                                <MenuItem key={item.item_id} item={item} />
                            ))}

                    </div>                        
                    <img src="/burger.png" alt="Picture of burgers" />
                </div>
                
            </div>
            <div className="category-container">
                <h2 className="menu-category">ALL DAY BREAKFAST</h2>
                <div className="menu-items">
                    <img src="/breakfast.png" alt="Picture of a breakfast item" />
                    <div className="menu-breakfast">
                        {breakfastItems.map((item) => (
                                <MenuItem key={item.item_id} item={item} />
                            ))}
                    </div>
                    
                </div>
            </div>
            <div className="category-container">
                <h2 className="menu-category">SALADS</h2>
                <div className="menu-salad">
                    {saladItems.map((item) => (
                            <MenuItem key={item.item_id} item={item} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;