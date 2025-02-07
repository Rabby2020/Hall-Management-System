import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [meals, setMeals] = useState([]);
  const [hallId, setHallId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    fetchUserHall();
  }, []);

  useEffect(() => {
    if (hallId) {
      fetchMeals();
    }
  }, [hallId]);

  useEffect(() => {
    if (selectedDate) {
      fetchMealsByDate();
    }
  }, [selectedDate]);

  const fetchUserHall = async () => {
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setHallId(res.data.hallId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`/api/meals/${hallId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMealsByDate = async () => {
    try {
      const res = await axios.get(`/api/meals/${hallId}/${selectedDate}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setSelectedMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const orderMeal = async (mealId) => {
    try {
      await axios.post(`/api/meals/${mealId}/order`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchMealsByDate();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (mealId) => {
    try {
      await axios.post(`/api/meals/${mealId}/cancel`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchMealsByDate();
    } catch (err) {
      console.error(err);
    }
  };

  const isOrderable = (mealDate) => {
    const today = new Date();
    const mealDay = new Date(mealDate);
    const diffTime = mealDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1;
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Check Meals for a Specific Day</h3>
      <label>Select Date: </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <ul>
        {selectedMeals.map((meal) => (
          <li key={meal._id}>
            {new Date(meal.date).toLocaleDateString()} - {meal.type}: {meal.menu} - ${meal.price}
            <button
              onClick={() => orderMeal(meal._id)}
              disabled={!isOrderable(meal.date) || meal.orders.includes(localStorage.getItem('userId'))}
            >
              {meal.orders.includes(localStorage.getItem('userId')) ? 'Ordered' : 'Order'}
            </button>
            <button
              onClick={() => cancelOrder(meal._id)}
              disabled={!isOrderable(meal.date) || !meal.orders.includes(localStorage.getItem('userId'))}
            >
              Cancel Order
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;