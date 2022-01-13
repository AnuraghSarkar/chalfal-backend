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

// Validate the link submission
const parseLinkSubmission = (linkSubmission) => { 
    if (!linkSubmission) {
        throw new Error("Link is required for link post type");
    }
    if (!validator.isURL(linkSubmission)) {
        throw new Error("Link is not a valid URL");
    }
    return linkSubmission;
}

const postTypeValidator = (type, text, link, image) => {
    switch (type) { 
        case 'Text':
            return {
              postType: "Text",
              textSubmisson: parseTextSubmission(text),
            };
        case 'Image':
            return {
                postType: "Image",
                imageSubmission: parseImageSubmission(image),
            }
        case 'Link':
            return {
                postType: "Link",
                linkSubmission: parseLinkSubmission(link),
            }
        default:
            throw new Error("Invalid post type please include a valid post type");
    }
};
 module.exports = postTypeValidator;