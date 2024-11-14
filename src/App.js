import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

const App = () => {
  const [counter, setCounter] = useState(1);
  const [date, setDate] = useState("");
  const [previousDate, setPreviousDate] = useState("");

  const cycleStartDate = new Date(2022, 0, 1); // "01/01/{currentYear}"
  const circleRadius = 260; // radius of the circle in px (half of the width/height of the circle div)
  const circumference = 2 * Math.PI * circleRadius; // Circumference of the circle

  const daysInCycle = 1460; // 4 years = 1460 days
  const daysInYear = 365; // 1 year = 365 days

  // Increment the counter based on the number of days passed since yearStart
  const incrementCounter = () => {
    const currentDate = new Date();
    const timeDifference = currentDate - cycleStartDate; // Difference in milliseconds
    const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert ms to days
    setCounter(daysPassed + 1); // Set counter to days passed since start of the year
  };

  const fetchDate = async () => {
    try {
      const response = await fetch(
        "https://www.timeapi.io/api/timezone/zone?timeZone=America%2FNew_York"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json(); // Parse the response to JSON
      const dateString = data.currentLocalTime; // Adjust based on the actual field name

      const currentDate = new Date(dateString);

      if (isNaN(currentDate)) {
        throw new Error("Invalid date");
      }

      const formattedDate = currentDate.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
      setDate(formattedDate);

      // Check if the day has changed (i.e., increment if the day is different from the previous one)
      if (formattedDate !== previousDate) {
        incrementCounter();
        setPreviousDate(formattedDate);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDate(); // Fetch the initial date when the component mounts
    incrementCounter(); // Increment counter based on days passed since the start of the year
  }, [previousDate]); // Re-run effect if previousDate changes

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDate(); // Fetch date periodically
    }, 43200000); // 12 hours
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Reset the ball position if the counter reaches 1460
  useEffect(() => {
    if (counter > 1460) {
      setCounter(1); // Reset the counter
    }
  }, [counter]);

  // Function to calculate the ball's position
  // const calculateBallPosition = counter => {
  //   const angle = (counter % 1460) * (360 / 1460) + 90; // Calculate angle based on counter (0 to 360 degrees)
  //   const radians = (angle * Math.PI) / 180; // Convert degrees to radians

  //   const x = -Math.cos(radians) * circleRadius; // X position of the ball
  //   const y = -Math.sin(radians) * circleRadius; // Y position of the ball

  //   // Calculate the area of the circle
  //   const area = Math.PI * Math.pow(circleRadius, 2); // Area = π * radius^2

  //   return { x, y, area };
  // };

  // const { x, y } = calculateBallPosition(counter); // Get the new ball position based on the counter

  const cycleYear = Math.floor((counter - 1) / daysInYear) + 1; // Calculate the current year in the 4-year cycle (1-4)
  const daysToNextYear = daysInYear - (counter % daysInYear); // Days remaining in the current year
  const daysUntilEnd = daysInCycle - counter; // Days remaining in the 4-year cycle

  const fillPercentage = counter / 1460; // Scale counter to a range from 0 to 1
  const dashOffset = circumference * (5 - fillPercentage); // Offset for the stroke

  return (
    <div className={styles.App}>
      {/* <h1 className={styles.title}>Four Year Cycle</h1> */}
      <div className={styles.details}>
        <p>Cycle Start: {cycleStartDate.toLocaleDateString("en-GB")}</p>
        <p>Cycle Year: {Math.floor(cycleYear)}</p>
        <p>Current Date: {date}</p>
        <p>Days passed: {counter}</p>
        <p>Days until next year: {daysToNextYear}</p>
        <p>Days remaining: {daysUntilEnd}</p>
      </div>
      <div className={styles.controls}>
        <button onClick={() => setCounter(prev => prev + 50)}>Increment</button>
      </div>
      <svg width="250" height="250" className={styles.circle}>
        <defs>
          <pattern
            id="imagePattern"
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <image
              href="/gradient.png"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice" // Ensure it fills the area without distortion
            />
          </pattern>

          <pattern
            id="bitcoinPattern"
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <image
              href="/bitcoin.png"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice" // Ensure it fills the area without distortion
              style={{
                transform: "rotate(90deg)", // Rotate the circle to start from the top
                transformOrigin: "center", // Ensure rotation happens around the center of the circle
              }}
            />
          </pattern>
        </defs>
        <circle
          cx="258"
          cy="258"
          r={circleRadius}
          fill="url(#bitcoinPattern)"
          stroke="url(#imagePattern)"
          strokeWidth="50"
          strokeDasharray={circumference} // Total length of the stroke
          strokeDashoffset={dashOffset} // Offset based on counter
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
            transform: "rotate(-90deg)", // Rotate the circle to start from the top
            transformOrigin: "center", // Ensure rotation happens around the center of the circle
          }}
        />
      </svg>
      {/* <div className={styles.circle}>
        <span
          className={styles.ball}
          style={{
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, // Move the ball to the new position
          }}
        >
          <img src="/favicon.ico" alt="ball" />
        </span>
      </div> */}
    </div>
  );
};

export default App;
