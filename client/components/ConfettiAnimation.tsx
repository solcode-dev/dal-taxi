import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete: () => void;
}

const { width, height } = Dimensions.get("window");
const CONFETTI_COUNT = 50;
const COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  rotation: number;
  size: number;
}

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    delay: Math.random() * 500,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
  }));
}

function ConfettiPieceComponent({ piece, visible }: { piece: ConfettiPiece; visible: boolean }) {
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(piece.delay, withTiming(1, { duration: 100 }));
      translateY.value = withDelay(
        piece.delay,
        withTiming(height + 100, {
          duration: 2000 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
        })
      );
      rotate.value = withDelay(
        piece.delay,
        withTiming(piece.rotation + 720, { duration: 2500 })
      );
    } else {
      translateY.value = -50;
      opacity.value = 0;
      rotate.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: piece.x,
          width: piece.size,
          height: piece.size * 0.6,
          backgroundColor: piece.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiAnimation({ visible, onComplete }: ConfettiAnimationProps) {
  const confetti = React.useMemo(() => generateConfetti(), [visible]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confetti.map((piece) => (
        <ConfettiPieceComponent key={piece.id} piece={piece} visible={visible} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confettiPiece: {
    position: "absolute",
    top: -20,
    borderRadius: 2,
  },
});
