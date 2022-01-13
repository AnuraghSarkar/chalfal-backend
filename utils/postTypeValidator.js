const validator = require('validator');

const parseTextSubmission = (textSubmission) => {
  if (!textSubmission) {
    throw new Error("Text is required for text post type");
  }
  return textSubmission;
};


const postTypeValidator = (type, text, link, image) => {
    switch (type) { 
        case 'Text':
            return {
              postType: "text",
              textSubmission: parseTextSubmission(text),
            };
        default:
            throw new Error("Invalid post type please include a valid post type");
    }
};
 module.exports = postTypeValidator;