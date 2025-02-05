# Blog Management System - MERN Stack

Welcome to the Blog Management System, a full-stack web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This platform allows users to register, log in, and interact with blog posts. Admins have additional privileges to manage categories, posts, and view analytics. Users can like, comment, and view posts, while admins can monitor the total number of posts.

## 🚀 Features

### User Features:
- **User Registration & Login**: Secure authentication system for user registration and login.
- **View Posts**: Users can browse and read blog posts and can view total view counts on particular posts.
- **Like Posts**: Users can like their favorite posts.
- **Comment on Posts**: Users can leave comments on posts.

### Admin Features:
- **Manage Categories**: Admins can add, edit, and delete categories.
- **Manage Posts**: Admins can create, edit, and delete blog posts.
- **Analytics Dashboard**: Admins can view the total number of posts and their view counts.
- **View Count Tracking**: The view count of each post increases as users view them.

## 🛠️ Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

Other Libraries:
- `bcrypt` for password hashing
- `mongoose` for MongoDB object modeling
- `zod-validator` for request validation
- `cors` for cross-origin resource sharing
- `dotenv` for environment variables

## 🌐 API Endpoints


### Authentication:
- **POST /auth/register**: Register a new user.
- **POST /auth/log**: Log in an existing user.
- **POST /auth/loguser**: Details of logged in of existing user.
- **GET /auth/getusers**: Get all Users.
- **GET /auth/getuser/:username**: Get a single user by username.
- **DELETE /auth/deleteuser/:username**: Delete a particular user by username.


### Categories (Admin Only):
- **GET /category/getAll**: Get all categories.
- **GET /category/getcategory/:id**: Get a single category by ID.
- **POST /category/addcategory**: Add a new category.
- **PUT /category/updatecategory/:id**: Update a category.
- **DELETE /category/delcategory:id**: Delete a category.

### Posts:
- **GET /posts/getAll**: Get all posts.
- **GET /posts/getID/:id**: Get a single post by ID.
- **POST /posts/addpost**: Create a new post (Admin Only).
- **PUT /posts/updatepost/:id**: Update a post (Admin Only).
- **DELETE /posts/delpost/:id**: Delete a post (Admin Only).
- **POST /posts/upload-image**: Uploading the Image (Admin Only).
- **POST /posts/getimage/:file** : Get the Image File.


### Likes & Comments:
- **POST /posts/likepost/:id/like**: Like a post.
- **GET /posts/getlikes/:id** : Get User Like for the Post.
- **DELETE /posts/dellikes/:id** : Delete all the likes for particular post (Admin only).
- **POST /posts/comment/:id/comment**: Add a comment to a post.
- **GET /posts/getcomment/:id** : Get User Comment for the Post.
- **DELETE /posts/delcomment/:id** : Delete all the comments for particular post (Admin only).


router.get("/analytics",analyticsController.getAnalysis)
router.get("/updateviews/:id",analyticsController.viewCount)
### Analytics (Admin Only):
- **GET /analysis/analytics**: Get the total number of posts.
- **GET /analysis/updateviews**: Get total views for each posts.

## 📁 Folder Structure

├── Blog-MANAGEMENT/                         # Backend folder (Node.js, Express)
│   ├── controllers/                         # Controller files for handling requests
│   │   ├── auth.controller.ts               # Handles user authentication
│   │   ├── category.controller.ts           # Handles category management
│   │   ├── post.controller.ts               # Handles post management
│   │   ├── analytics.controller.ts          # Handles analytics
│   ├── middlewares/                         # Middleware file (e.g., for validation)
│   │   └── error.handlers.ts                # Middleware for request validation
│   ├── models/                              # Mongoose models for MongoDB
│   │   ├── usermodel.ts                     # User model
│   │   ├── postmodel.ts                     # Post model
│   │   ├── catmodel.ts                      # Category model
│   │   ├── counter.ts                       # Post Counter model
│   │   └── catcounter.ts                    # Category Comment model
│   ├── routes/                              # API route files
│   │   ├── auth.ts                          # Routes for user authentication
│   │   ├── category.ts                      # Routes for category management
│   │   ├── posts.ts                         # Routes for post management
│   │   └── analytics.ts                     # Routes for analytics
│   ├── server.ts                            # Main server entry file
│   └── .env.example                         # Environment variables (e.g., JWT secret, database URI)
│   └── package.json                         # Backrend dependencies
│   ├── uploads/                             # Folder for uploaded Image
├── .gitignore                               # Git ignore file
├── .tsconfig.json                           # Typescript config file
└── README.md                                # Project readme


## Install the required dependencies:

npm install

## Run the backend server:

nodemon

## 📥 Installation & Setup

### Clone the repository
To get started with the project, first, clone the repository to your local machine using Git:

git clone https://github.com/devarsh281/Blog.git
