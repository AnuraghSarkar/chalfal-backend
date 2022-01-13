const validator = require('validator');

// Validates the text submission
const parseTextSubmission = (textSubmission) => {
  if (!textSubmission) {
    throw new Error("Text is required for text post type");
  }
  return textSubmission;
};

// Validates the image submission
const parseImageSubmission = (imageSubmission) => { 
    if (!imageSubmission) {
        throw new Error("Image is required for image post type");
    }
    return imageSubmission;
};

const postTypeValidator = (type, text, link, image) => {
    switch (type) { 
        case 'Text':
            return {
              postType: "text",
              textSubmission: parseTextSubmission(text),
            };
        case 'Image':
            return {
                postType: "image",
                imageSubmission: parseImageSubmission(image),
            }
        default:
            throw new Error("Invalid post type please include a valid post type");
    }
};
 module.exports = postTypeValidator;