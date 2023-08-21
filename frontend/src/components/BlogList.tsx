import { Blog, Short } from '@nest/shared';

import '../styles/blogList.css';
import { BlogIcon } from './BlogIcon';

export const BlogList: React.FC<{ posts: (Blog | Short)[] }> = ({ posts }) => {
  return (
    <div className="blog-list">
      {posts.map(post => (
        <BlogIcon post={post} key={post.id} />
      ))}
    </div>
  );
};

// import { Blog, Short } from '@nest/shared';
// import { useEffect, useRef } from 'react';

// import '../styles/blogList.css';
// import { BlogIcon } from './BlogIcon';

// export const BlogList: React.FC<{ posts: (Blog | Short)[] }> = ({ posts }) => {
//   // Create a reference to the last element
//   const lastElementRef = useRef(null);

//   // Create an observer using useEffect hook
//   useEffect(() => {
//     // Define the callback function
//     const handleObserver = (entries: string | any[]) => {
//       // Get the last entry
//       const lastEntry = entries[entries.length - 1];
//       // Check if it is intersecting
//       if (lastEntry.isIntersecting) {
//         // Call fetchData to load more posts
//         fetchData();
//       }
//     };

//     // Create an observer with the callback and options
//     const observer = new IntersectionObserver(handleObserver, {
//       root: null,
//       rootMargin: '0px',
//       threshold: 1.0,
//     });

//     // Get the current last element
//     const currentLastElement = lastElementRef.current;
//     // If it exists, start observing it
//     if (currentLastElement) {
//       observer.observe(currentLastElement);
//     }

//     // Return a cleanup function to stop observing
//     return () => {
//       if (currentLastElement) {
//         observer.unobserve(currentLastElement);
//       }
//     };
//   }, [lastElementRef]);

//   return (
//     <div className="blog-list">
//       {posts.map((post, index) => (
//         // If it is the last element, assign the reference to it
//         <div key={post.id} ref={index === posts.length - 1 ? lastElementRef : null}>
//           <BlogIcon post={post} />
//         </div>
//       ))}
//     </div>
//   );
// };
