const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numberViews: {
      type: Number,
      default: 0,
    },
    // isLiked: {
    //   type: Boolean,
    //   default: false,
    // },
    // isDisliked: {
    //   type: Boolean,
    //   default: false,
    // },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://blog-pages.co.uk/wp-content/uploads/2017/11/Blog-Pages-logo-basic.png",
    },

    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
