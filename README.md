Step 1: first clone this repository to your local machine using the following command one by one :
git clone https://github.com/sami4346/Tools_Frontend.git
cd Tools_Frontend

npm install
npm install cors
npm install firebase
npm install react-router-dom
npm install dotenv
npm install tailwindcss @tailwindcss/vite


Step 2: create a new file named .env in the root directory of the project and add - 
VITE_API_URL = Your_firebase_API_URL
VITE_FIREBASE_API_KEY = Your_firebase_API_KEY
VITE_FIREBASE_AUTH_DOMAIN = Your_firebase_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID = Your_firebase_PROJECT_I
VITE_FIREBASE_STORAGE_BUCKET = Your_firebase_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID = Your_firebase_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID = Your_firebase_APP_ID

# To run the backend, type this command
npm run dev
