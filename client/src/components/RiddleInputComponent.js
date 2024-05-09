import React, { useEffect, useState } from 'react';
import '../assets/styles/RiddleInputComponent.css'; // Ensure you import the CSS for styling

const RiddleInputComponent = ({ setKeys }) => {
    const [input, setInput] = useState('');
    const [riddle, setRiddle] = useState({}); // Set to no riddles to answer
    const [showForm, setShowForm] = useState(false); // State to control the visibility of the form

    // Fetch a riddle when the component mounts
    useEffect(() => {
        fetchFirstRiddle();
    }, []);

    const fetchFirstRiddle = async () => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiBaseUrl}/riddles/first-locked`);
            if (!response.ok) {
                throw new Error(`Status code ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setRiddle(data);
        } catch (error) {
            console.error('Failed to fetch riddle: ', error);
            setRiddle({ unlocked : true });
        }
    }

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
            console.log(result.correct);
            if (result.correct) {
                setKeys(result.keys); // Callback to update keys in parent component
                setInput(''); // Clear input after correct answer
                setShowForm(false); // Hide the form after a correct answer
                fetchFirstRiddle(); // Can query next riddle assuming serial ones
            } else {
                alert("Wrong answer, try again!");
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    return (
        <div className="riddle-area">
            {!riddle.unlocked && (
                <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                    {showForm ? 'Hide Riddle' : 'Show Riddle'}
                </button>
            )}
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
