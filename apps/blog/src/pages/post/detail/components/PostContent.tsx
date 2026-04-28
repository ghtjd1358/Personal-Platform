import React from 'react';

interface PostContentProps {
  postId: string;
  content: string;
}

const PostContent: React.FC<PostContentProps> = ({ postId, content }) => {
  return (
    <div className="post-content-wrapper">
      <div
        key={`content-${postId}`}
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export { PostContent };
