import React from "react";

interface IInfinityScrollProps extends React.PropsWithChildren {
  fetchData: () => void;
  isOver: boolean;
  isLoading: boolean;
}

const InfinityScroll: React.FC<IInfinityScrollProps> = ({ fetchData, children, isLoading, isOver = false }) => {
  const trigerRef = React.useRef<HTMLDivElement>(null);
  const handleIntersection: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;

    if (entry.isIntersecting && !isLoading) fetchData();
  };

  React.useEffect(() => {
    const triger = trigerRef.current;

    if (isLoading) return;
    if (triger === null) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px 0px 100px 0px",
      threshold: 1,
    });

    observer.observe(triger);

    if (isOver) observer.unobserve(triger);

    return () => {
      if (triger) observer.unobserve(triger);
    };
  }, [isLoading, isOver]);

  return (
    <div className="relative">
      {children}
      <div className="absolute w-full h-[50px] bottom-[50px] pointer-events-none" ref={trigerRef}></div>
    </div>
  );
};

export { InfinityScroll };
