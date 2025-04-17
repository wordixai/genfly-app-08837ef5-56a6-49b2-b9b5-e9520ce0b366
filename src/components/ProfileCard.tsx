import { User, SwipeDirection } from '@/types';
import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Star, MessageCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  user: User;
  onSwipe: (direction: SwipeDirection, userId: string) => void;
}

export function ProfileCard({ user, onSwipe }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const xOffset = info.offset.x;
    const yOffset = info.offset.y;
    
    if (xOffset > 100) {
      onSwipe('right', user.id);
    } else if (xOffset < -100) {
      onSwipe('left', user.id);
    } else if (yOffset < -100) {
      onSwipe('up', user.id);
    } else {
      // Reset position if not swiped far enough
      x.set(0);
      y.set(0);
    }
  };
  
  const nextImage = () => {
    if (currentImageIndex < user.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };
  
  const handleTap = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    
    const cardWidth = card.offsetWidth;
    const clickX = e.nativeEvent.offsetX;
    
    if (clickX > cardWidth * 0.7) {
      nextImage();
    } else if (clickX < cardWidth * 0.3) {
      prevImage();
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full max-w-md"
      style={{ x, y, rotate, zIndex: 10 }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
    >
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-[70vh] max-h-[600px]" onClick={handleTap}>
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {user.distance} miles away
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white">
              {user.compatibility}% Match
            </Badge>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h2 className="text-2xl font-bold">{user.name}, {user.age}</h2>
            <p className="text-sm opacity-90">{user.location} • Active {user.lastActive}</p>
          </div>
          
          <div className="absolute top-0 left-0 right-0 z-0 flex h-1">
            {user.images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex-1 h-1 mx-0.5 rounded-full transition-opacity",
                  idx === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
          
          <img 
            src={user.images[currentImageIndex]} 
            alt={`${user.name}'s photo`}
            className="h-full w-full object-cover"
          />
        </div>
        
        <CardContent className={cn(
          "transition-all duration-300 ease-in-out",
          expanded ? "max-h-[500px]" : "max-h-[100px]"
        )}>
          <div className="flex flex-wrap gap-1 py-2">
            {user.interests.map(interest => (
              <Badge key={interest} variant="outline" className="bg-primary/10">
                {interest}
              </Badge>
            ))}
          </div>
          
          <p className={cn(
            "text-sm text-muted-foreground transition-all duration-300",
            expanded ? "line-clamp-none" : "line-clamp-2"
          )}>
            {user.bio}
          </p>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-primary"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex justify-center gap-4">
        <button 
          onClick={() => onSwipe('left', user.id)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-md transition-transform hover:scale-110"
        >
          <X size={24} />
        </button>
        
        <button 
          onClick={() => onSwipe('up', user.id)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-500 shadow-md transition-transform hover:scale-110"
        >
          <Star size={24} />
        </button>
        
        <button 
          onClick={() => onSwipe('right', user.id)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-500 shadow-md transition-transform hover:scale-110"
        >
          <Heart size={24} />
        </button>
      </div>
    </motion.div>
  );
}