import { Star, StarHalf } from "lucide-react";
// import { EmptyStar, FullStar, HalfStar } from "../../utils/assets";

const StarReview = ({ rating = 3.5 }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (rating >= index + 1) {
      return <Star className="text-yellow-400" />;
    } else if (rating >= index + 0.5) {
      return (
        <div className="flex gap-0">
          <StarHalf className="text-yellow-400" />
          <StarHalf className="-scale-x-[1] -ml-6" />
        </div>
      );
    } else {
      return <Star />;
    }
  });
  return (
    <div key={rating} className="flex items-center gap-x-1">
      {stars}
    </div>
  );
};

export default StarReview;
