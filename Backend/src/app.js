import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

app.use(cors ({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
// app.use(express.cookieParser())
app.use(cookieParser());


//routes
import userRoutes from "./routes/user.routes.js"
import registrationRoutes from "./routes/registration.routes.js"
import qrRoutes from "./routes/qrCheckIn.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import feedbackRoutes from "./routes/feedback.routes.js"
import eventRoutes from "./routes/event.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import adminRoutes from "./routes/adminActivityLog.routes.js"


//routes declaration
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/registrations",registrationRoutes)
app.use("/api/v1/qrChecIn",qrRoutes)
app.use("/api/v1/notifications",notificationRoutes)
app.use("/api/v1/feedbacks",feedbackRoutes)
app.use("/api/v1/events",eventRoutes)
app.use("/api/v1/analytics",analyticsRoutes)
app.use("/api/v1/admin_activity",adminRoutes)


export {app}