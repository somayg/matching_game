# Matching Mayhem Game Overview
- This a image to name matching game built using images from the WeedNet database and distances from its embedding space. The game utilizes the distances to distinguish difficulty levels, so the closer the images are in distance the harder the game level and vice versa. The game logic shuffles a set of cards containing image-name pairs, tracks user clicks and checks for matches. The game checks for missed matches in the backend and uses this to regenerate a grid with those missed matches so that the user has a chance to relearn those weeds. 

# Features
- Image to Name matching
- Tracks scores and missed matches
- 2 difficulty levels (easy and hard)

# Built With
- React
- Python

# Frontend 
- App.js is the home page

- Level.js is where users select the difficulty of the game (right now they both link to Game.js so the difficulty level is the same). This can be altered by deleting it and just linking the App.js page to Game.js as Level.js is not necessary anymore.

- Game.js handles the game logic using the following arrays: 
 * cards - array of card objects shown on the game grid
 * flipped - stores indexes of currently flipped cards
 * matched - list of card names that have been matched 
 * score - keeps track of successful matches which reflect on the user's score
 * lockBoard - prevents flipping additional cards while two are being evaluated
 * gameId - used to fetch a new game by numbering and incrementing game grids
 * missedCards - tracks incorrect matches to replay later

- Game.js is dependent on FastAPI. Game.js utilizes an await to fetch a game grid from FastAPI located at http://localhost:8000/generate-grid. It then takes the game cards given by FastAPI and displays them on the user interface. 

-package.json and package-lock.json contain all the dependencies for the react app

-public folder contains images folder which has all the images grouped by species name (this is not used instead we have a replica of this in the backend that is used to generate the game grid)

# Backend
- weed_dataset contains all the images used in generating the game grid. 
- app.py and app2.py were used to convert the given .csv files with the distances into json files to be used in the game
- predict_app.py:
  * contains our FastAPI which generates our game grid depending on difficulty and returns this to Game.js to be displayed in the frontend


# How to Run (developers):
First step: Download the project 

- FastAPI:
  * In your terminal, make sure you are in the backend folder: cd backend
  * create a virtual environment running the following commands: python -m venv venv
  * activate the virtual environment: venv\Scripts\activate (Windows) OR source venv/bin/activate (macOS)
  * install required packages: pip install fastapi uvicorn
  * run the FastAPI server: uvicorn predict_api:app --reload

- React app: 
  * open your terminal  
  * make sure you are inside the frontend folder: cd frontend
  * if you haven't already, download Node.js and npm
  * Install dependencies: npm install 
  * run: npm start (to load the react app in a webpage)

