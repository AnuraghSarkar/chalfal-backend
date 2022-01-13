const numofComments = (commentsArray) => {
    const numOfReplies = commentsArray.map(comment => comment.replies.length).reduce((a, b) => a + b, 0);
    return commentsArray.length + numOfReplies;
 };