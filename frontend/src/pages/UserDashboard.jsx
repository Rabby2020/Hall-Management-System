// frontend/src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [meals, setMeals] = useState([]);
  const [hallId, setHallId] = useState('');

  useEffect(() => {
    fetchUserHall();
  }, []);

  useEffect(() => {
    if (hallId) {
      fetchMeals();
    }
  }, [hallId]);

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

  const orderMeal = async (mealId) => {
    try {
      await axios.post(`/api/meals/${mealId}/order`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchMeals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Upcoming Meals</h3>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            {new Date(meal.date).toLocaleDateString()} - {meal.type}: {meal.menu}
            <button onClick={() => orderMeal(meal._id)}>
              {meal.orders.includes(localStorage.getItem('userId')) ? 'Ordered' : 'Order'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;