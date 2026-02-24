import { Blog, Short } from '@nest/shared';

import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

import { useLikeButton } from '../hooks/useLike';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [anim, setAnim] = useState<'idle' | 'up' | 'down'>('idle');

  useEffect(() => {
    if (value !== prevValue && anim === 'idle') {
      setAnim(value > prevValue ? 'up' : 'down');
      const timer = setTimeout(() => {
        setPrevValue(value);
        setAnim('idle');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue, anim]);

  return (
    <div className="relative inline-flex items-center justify-center overflow-hidden h-[1.2em] w-[3ch]">
      <span
        className={`absolute flex items-center justify-center inset-0 ${
          anim === 'up' ? 'animate-slide-up-old' : anim === 'down' ? 'animate-slide-down-old' : ''
        }`}
      >
        {prevValue}
      </span>
      {anim !== 'idle' && (
        <span
          className={`absolute flex items-center justify-center inset-0 ${
            anim === 'up' ? 'animate-slide-up-new' : 'animate-slide-down-new'
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export const LikeBlogButton: React.FC<{ post: Blog | Short }> = props => {
  const { post } = props;
  const { postLikeMutate, deleteLikeMutate, blogLikes } = useLikeButton(post.id);

  const [localIsLiked, setLocalIsLiked] = useState<boolean | null>(null);
  const [localLikes, setLocalLikes] = useState<number | null>(null);

  useEffect(() => {
    if (blogLikes.data) {
      if (!postLikeMutate.isLoading && !deleteLikeMutate.isLoading) {
        setLocalIsLiked(blogLikes.data.isLiked);
        setLocalLikes(blogLikes.data.likes);
      }
    }
  }, [blogLikes.data, postLikeMutate.isLoading, deleteLikeMutate.isLoading]);

  const isLiked = localIsLiked !== null ? localIsLiked : blogLikes.data?.isLiked;
  const likesCount = localLikes !== null ? localLikes : blogLikes.data?.likes || 0;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (blogLikes.isLoading || postLikeMutate.isLoading || deleteLikeMutate.isLoading) return;

    if (isLiked) {
      setLocalIsLiked(false);
      setLocalLikes(prev => (prev ? prev - 1 : 0));
      deleteLikeMutate.mutate();
    } else {
      setLocalIsLiked(true);
      setLocalLikes(prev => (prev !== null ? prev + 1 : 1));
      postLikeMutate.mutate();
    }
  };

  return (
    <>
      <style>
        {`
          .animate-slide-up-old { animation: slideUpOld 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .animate-slide-up-new { animation: slideUpNew 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .animate-slide-down-old { animation: slideDownOld 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .animate-slide-down-new { animation: slideDownNew 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          @keyframes slideUpOld { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-100%); opacity: 0; } }
          @keyframes slideUpNew { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes slideDownOld { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
          @keyframes slideDownNew { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}
      </style>
      <div className="flex items-center">
        <button
          className="group flex items-center gap-2 rounded-full px-3 py-1.5 transition-transform hover:scale-110 active:scale-95"
          onClick={handleToggleLike}
          disabled={blogLikes.isLoading}
        >
          <span
            className={`text-lg flex items-center gap-1.5 font-bold transition-colors ${
              isLiked
                ? 'text-red-500'
                : 'text-text-secondary-light dark:text-text-secondary-dark group-hover:text-red-500/80'
            }`}
          >
            <AnimatedCounter value={likesCount} />
            <div
              className={`transition-all duration-200 ${
                isLiked ? 'scale-110' : 'scale-100 group-hover:scale-110'
              }`}
            >
              {isLiked ? <FaHeart className="text- drop-shadow-sm" /> : <FiHeart />}
            </div>
          </span>
        </button>
      </div>
    </>
  );
};
