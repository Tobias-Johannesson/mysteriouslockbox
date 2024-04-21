import React, { useEffect, useState } from 'react';
import '../assets/styles/RiddleInputComponent.css'; // Ensure you import the CSS for styling

const RiddleInputComponent = ({ onNewKeyObtained }) => {
    const [input, setInput] = useState('');
    const [riddle, setRiddle] = useState({});
    const [showForm, setShowForm] = useState(false); // State to control the visibility of the form

    // Fetch a riddle when the component mounts
    useEffect(() => {
        fetchRiddle(1); // Assuming you have a default riddle to fetch initially
    }, []);

    const fetchRiddle = async (riddleId) => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiBaseUrl}/riddles/${riddleId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setRiddle(data);
        } catch (error) {
            console.error('Failed to fetch riddle:', error);
        }
    };

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiBaseUrl}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ riddleId: riddle.id, answer: input })
            });

            const result = await response.json();
            if (result.correct) {
                onNewKeyObtained(); // Callback to update keys in parent component
                setInput(''); // Clear input after correct answer
                setShowForm(false); // Hide the form after a correct answer
            } else {
                alert("Wrong answer, try again!");
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    return (
        <div className="riddle-area">
            <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                {showForm ? 'Hide Riddle' : 'Show Riddle'}
            </button>
            {showForm && (
                <div className="riddle-form">
                    <div className="riddle-question">{riddle.riddle}</div>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={handleChange}
                            placeholder="Enter your answer..."
                            className="riddle-input"
                        />
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RiddleInputComponent;
