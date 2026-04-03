import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    solved: {
        type: Boolean,
        default: false
    },

    description: {
        type: String,
        required: true
    },

    solution: {
        type: String,
        default: ""
    },

    category: {
        type: String
    },

    tags: {
        type: [String],
        default: []
    },

    resourcesUsed: {
        type: [String], 
        default: []
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
    }

}, {
    timestamps: true 
});

// mistakeSchema.index({
//     title: "text",
//     description: "text",
//     solution: "text",
//     category: "text",
//     tags: "text"
// });

const Mistake = mongoose.model("Mistake", mistakeSchema);

export default Mistake;