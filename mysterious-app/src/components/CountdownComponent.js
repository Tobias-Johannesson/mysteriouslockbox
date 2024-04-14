import React, { useState, useEffect } from 'react';

const CountdownComponent = ({ targetDate }) => {
  const [message, setMessage] = useState("Welcome, and prepare yourself");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor((difference / (1000 * 60 * 60 * 24)));
        const minutes = Math.floor((difference / (1000 * 60 * 60 * 24)));
        const seconds = Math.floor((difference / (1000 * 60 * 60 * 24)));
        var newMessage = "";

        if (days < 0) {
          newMessage = `The wait is almost over! The adventure begins in ${minutes} minutes and ${seconds} seconds...`;
        } else {
          newMessage = `Hi there, brave challenger! This lockbox contains your reward, but it seems you're a bit early.
              The adventure begins ${targetDate.toDateString()}. Keep your eyes peeled and come back in roughly ${days} days...`;
        }
        setMessage(newMessage);
      } else {
        setMessage("It's time!");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      <img src="/lockbox.png" alt="Lockbox" />
      <h1>Welcome to the mysterious lockbox!</h1>
      <p>{message}</p>
    </div>
  );
};

export default CountdownComponent;
