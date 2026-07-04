import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingCardMenu = () => {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <Card
          className="relative lg:max-w-sm pt-0"
          key={`loading-card-menu-${index}`}
        >
          <Skeleton className="relative z-20 aspect-square w-full object-cover" />
          <CardHeader>
            <CardTitle className="font-bold">
              <Skeleton className="w-2/2 h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-1/2 h-5 mt-1" />
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-3 justify-between">
            <Skeleton className="w-2/3 h-6" />
            <Skeleton className="w-1/3 h-6" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default LoadingCardMenu;
