# Jarviot Challenge Full Stack
This project is a full-stack application designed to enable users to securely access their Google Drive account and view data analytics, including storage usage, total storage available, and a risk score (with potential limitations in accuracy). Additionally, the application displays a list of files in the user's drive, complete with their respective public links and sizes. This project serves as a powerful tool for those seeking to better understand and optimize their use of Google Drive.

## Getting Started
To get started with this project, you need to clone the repository to your local machine. You can do this by running the following command in your terminal:
```
git clone https://github.com/Nis7538/jarviot-challenge-full-stack.git
```

## Installing Dependencies
After cloning the repository, navigate to the frontend and backend directories and install the required dependencies:
For frontend:
```
cd jarviot-challenge-frontend
npm install
```
For backend:
```
cd jarviot-challenge-backend
npm install
```

## Creating a Google OAuth2 Token with Google Drive API access
Google OAuth2 Token with access to Google Drive API will be required which you can create on Google Cloud Console. When creating a token, set the Authorized JavaScript origins as http://localhost:3000 and Authorized redirect URIs as http://localhost:3000/api/v1/google/callback
Now, Google Developer Console will provide you with 3 different keys and their values: CLIENT_ID, CLIENT_SECRET and REDIRECT_URI. 

## Setting up environment variables
Rename the example.env file to .env and fill the values of keys and their values you received from the Google Developer Console and set the MONGO_URI variable as the url of your MongoDB Database.
```
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=http://localhost:3000/api/v1/google/callback
MONGO_URI=
JWT_SECRET_KEY=JarviotChallenge
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

## Running the app
For Backend, open new terminal and run the following commands:
```
cd jarviot-challenge-backend
npm start
```
For Frotend, open new terminal and run the following commands:
```
cd jarviot-challenge-frontend
npm run dev
```
Open the localhost url provided in the terminal to view the Google Drive Risk Report Application.

## Contributing
If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Please ensure that any changes made adhere to the project's coding standards and are thoroughly tested.
