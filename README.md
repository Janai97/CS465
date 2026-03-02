Architecture

In this project, I worked with two different types of frontend development. The first was the Express HTML customer-facing site that used Handlebars templates. That version followed the MVC structure, where the server handled routing, controllers, and views. Every time the user clicked a link, the server rendered a new page. The logic was mostly handled on the server side.

The second frontend was the Angular single-page application for the admin side. Instead of reloading pages, Angular handled routing inside the browser. Once the app loaded, navigation happened without refreshing the page. The SPA communicated with the backend through API calls and updated the screen dynamically. This created a smoother and faster user experience compared to the Express site.

The backend used MongoDB because it works naturally with JSON data. Since the frontend and backend communicate using JSON, MongoDB fits well with the MEAN stack. It also allows flexible data structures, which made it easier to store and manage travel packages without using relational tables.

⸻

Functionality

JSON is a data format used to send structured data between systems. It looks similar to JavaScript objects, but it only stores data and does not contain logic or functions. In this project, JSON connected the frontend and backend. The Express API returned JSON responses, and Angular used that data to display trips, fill forms, and update records.

During development, I refactored code to improve organization and efficiency. For example, I moved shared layout pieces like the header and footer into reusable partials in Express. In Angular, I created reusable components like the trip-card component so I didn’t have to repeat the same layout for every trip. I also centralized API calls in services like TripData and Authentication. Reusable UI components make the project easier to maintain, reduce duplicate code, and keep everything consistent.

⸻

Testing

Testing a full stack application requires understanding HTTP methods and endpoints. GET retrieves data, POST creates new data, PUT updates data, and DELETE removes data. I used Postman to test API endpoints before connecting them to Angular. This helped confirm the backend was working correctly.

Adding security made testing more complex. Once JWT authentication was implemented, protected routes required a valid token in the Authorization header. Without a token, the server returned a 401 error. I had to test logging in to receive a token and then include that token in requests for adding, editing, or deleting trips. On the Angular side, I used an HTTP interceptor to automatically attach the token to requests. This process helped me understand how security works across the full stack.

⸻

Reflection

This course helped me better understand how frontend and backend systems connect. Before this class, I understood pieces of web development separately, but now I understand how everything works together in a full stack application.

I learned how to build an Express MVC application, design RESTful APIs, structure a MongoDB database with Mongoose, and build a responsive Angular SPA. I also implemented JWT authentication and secured protected endpoints. Debugging issues between the client and server improved my problem-solving skills and confidence.
