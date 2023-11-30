const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
        required: [true, "A like must have a post"],
    },
    reason: {
        type: String,
        required: [true, "Please tell us your reason!"],
        },
    status: {
        type: String,
        enum: ["Processing", "Done"],
        default: "Processing",
        },
    processingDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const ReportModel = mongoose.model("Report", ReportSchema);

module.exports = ReportModel;
