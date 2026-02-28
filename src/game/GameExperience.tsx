import { router } from "expo-router";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButtons } from "../components/controls/ActionButtons";
import { VirtualJoystick } from "../components/controls/VirtualJoystick";
import { AppBackdrop } from "../components/layout/AppBackdrop";
import { useGameLoop } from "../engine/useGameLoop";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { fireHaptic } from "../services/haptics";
import { useGameSettings } from "../store/game-settings";
import { clamp, theme } from "../theme";
import { GameInput, GameWorld } from "./types";
import { createWorld, resizeWorld, updateWorld } from "./world";

export function GameExperience() {
  const device = useDeviceProfile();
  const { settings } = useGameSettings();
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });
  const [world, setWorld] = useState<GameWorld | null>(null);
  const [paused, setPaused] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [boostActive, setBoostActive] = useState(false);
  const inputRef = useRef<GameInput>({
    boost: false,
    move: { x: 0, y: 0 },
    pulse: false
  });

  const joystickSize = Math.round(
    clamp((device.isLandscape ? 118 : 152) * device.controlScale, 108, 176)
  );
  const pulseSize = Math.round(
    clamp((device.isLandscape ? 88 : 108) * device.controlScale, 84, 132)
  );

  useEffect(() => {
    if (settings.keepAwake) {
      void activateKeepAwakeAsync("game-session");
    } else {
      void deactivateKeepAwake("game-session");
    }

    return () => {
      void deactivateKeepAwake("game-session");
    };
  }, [settings.keepAwake]);

  useEffect(() => {
    if (!arenaSize.width || !arenaSize.height) {
      return;
    }

    setWorld((current) =>
      current ? resizeWorld(current, arenaSize) : createWorld(arenaSize)
    );
  }, [arenaSize.height, arenaSize.width]);

  useEffect(() => {
    if (!world || world.event === "none") {
      return;
    }

    if (world.score > bestScore) {
      setBestScore(world.score);
    }

    switch (world.event) {
      case "collect":
        void fireHaptic(settings.haptics, "collect");
        break;
      case "hit":
      case "game-over":
        void fireHaptic(settings.haptics, "damage");
        break;
      case "pulse":
        void fireHaptic(settings.haptics, "boost");
        break;
    }
  }, [bestScore, settings.haptics, world?.event, world?.eventNonce, world?.score]);

  useGameLoop(Boolean(world) && !paused && !world?.gameOver, (deltaSeconds) => {
    setWorld((current) => {
      if (!current) {
        return current;
      }

      return updateWorld(current, inputRef.current, deltaSeconds);
    });

    if (inputRef.current.pulse) {
      inputRef.current = {
        ...inputRef.current,
        pulse: false
      };
    }
  });

  function handleArenaLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    setArenaSize((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return {
        width,
        height
      };
    });
  }

  function handlePauseToggle() {
    void fireHaptic(settings.haptics, "pause");
    setPaused((current) => !current);
  }

  function handlePulse() {
    inputRef.current = {
      ...inputRef.current,
      pulse: true
    };
  }

  function handleRestart() {
    if (!arenaSize.width || !arenaSize.height) {
      return;
    }

    void fireHaptic(settings.haptics, "confirm");
    setPaused(false);
    setBoostActive(false);
    inputRef.current = {
      boost: false,
      move: { x: 0, y: 0 },
      pulse: false
    };
    setWorld(createWorld(arenaSize));
  }

  function leaveGame() {
    void fireHaptic(settings.haptics, "tap");
    router.replace("/");
  }

  return (
    <View style={styles.root}>
      <AppBackdrop />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Score</Text>
            <Text style={styles.metricValue}>{world?.score ?? 0}</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Best</Text>
            <Text style={styles.metricValue}>{bestScore}</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Health</Text>
            <Text style={styles.metricValue}>{world?.player.health ?? 0}</Text>
          </View>
          <Pressable
            onPress={handlePauseToggle}
            style={({ pressed }) => [
              styles.pauseButton,
              pressed && styles.pauseButtonPressed
            ]}
          >
            <Text style={styles.pauseLabel}>{paused ? "Resume" : "Pause"}</Text>
          </Pressable>
        </View>

        <View onLayout={handleArenaLayout} style={styles.arenaShell}>
          {world ? <Arena world={world} /> : null}

          {paused || world?.gameOver ? (
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>
                {world?.gameOver ? "Run Over" : "Paused"}
              </Text>
              <Text style={styles.overlayText}>
                {world?.gameOver
                  ? "Restart the loop or head back to the menu shell."
                  : "The session is frozen. Resume when you are ready."}
              </Text>
              <View style={styles.overlayButtons}>
                <Pressable onPress={handleRestart} style={styles.overlayPrimary}>
                  <Text style={styles.overlayPrimaryText}>Restart</Text>
                </Pressable>
                <Pressable onPress={leaveGame} style={styles.overlaySecondary}>
                  <Text style={styles.overlaySecondaryText}>Menu</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.controlsRow,
            device.isLandscape && styles.controlsRowLandscape
          ]}
        >
          {settings.handPreference === "left" ? (
            <>
              <ActionButtons
                boostActive={boostActive}
                handPreference={settings.handPreference}
                onBoostChange={(value) => {
                  setBoostActive(value);
                  inputRef.current = {
                    ...inputRef.current,
                    boost: value
                  };
                }}
                onPulse={handlePulse}
                showGuide={settings.showTouchGuide}
                size={pulseSize}
              />
              <VirtualJoystick
                label="Movement"
                onChange={(move) => {
                  inputRef.current = {
                    ...inputRef.current,
                    move
                  };
                }}
                onEngage={() => {
                  void fireHaptic(settings.haptics, "tap");
                }}
                showGuide={settings.showTouchGuide}
                size={joystickSize}
              />
            </>
          ) : (
            <>
              <VirtualJoystick
                label="Movement"
                onChange={(move) => {
                  inputRef.current = {
                    ...inputRef.current,
                    move
                  };
                }}
                onEngage={() => {
                  void fireHaptic(settings.haptics, "tap");
                }}
                showGuide={settings.showTouchGuide}
                size={joystickSize}
              />
              <ActionButtons
                boostActive={boostActive}
                handPreference={settings.handPreference}
                onBoostChange={(value) => {
                  setBoostActive(value);
                  inputRef.current = {
                    ...inputRef.current,
                    boost: value
                  };
                }}
                onPulse={handlePulse}
                showGuide={settings.showTouchGuide}
                size={pulseSize}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function Arena({ world }: { world: GameWorld }) {
  const blink =
    world.player.invulnerableFor > 0 && Math.floor(world.time * 10) % 2 === 0;

  return (
    <View style={styles.arena}>
      <View
        style={[
          styles.orb,
          {
            height: world.orb.radius * 2,
            left: world.orb.position.x - world.orb.radius,
            top: world.orb.position.y - world.orb.radius,
            width: world.orb.radius * 2
          }
        ]}
      />
      {world.hazards.map((hazard) => (
        <View
          key={hazard.id}
          style={[
            styles.hazard,
            {
              borderRadius: hazard.radius,
              height: hazard.radius * 2,
              left: hazard.position.x - hazard.radius,
              top: hazard.position.y - hazard.radius,
              width: hazard.radius * 2
            }
          ]}
        />
      ))}
      <View
        style={[
          styles.player,
          blink && styles.playerBlink,
          {
            borderRadius: world.player.radius,
            height: world.player.radius * 2,
            left: world.player.position.x - world.player.radius,
            top: world.player.position.y - world.player.radius,
            width: world.player.radius * 2
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm
  },
  metricBlock: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    minWidth: 74,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  metricLabel: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.label,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  metricValue: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 20
  },
  pauseButton: {
    backgroundColor: theme.colors.cardMuted,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  pauseButtonPressed: {
    opacity: 0.82
  },
  pauseLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14
  },
  arenaShell: {
    backgroundColor: "rgba(9, 18, 31, 0.72)",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden",
    position: "relative"
  },
  arena: {
    flex: 1
  },
  orb: {
    backgroundColor: theme.colors.orb,
    borderRadius: 999,
    position: "absolute"
  },
  hazard: {
    backgroundColor: theme.colors.hazard,
    position: "absolute"
  },
  player: {
    backgroundColor: theme.colors.player,
    position: "absolute"
  },
  playerBlink: {
    opacity: 0.45
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(7, 17, 31, 0.76)",
    gap: theme.spacing.md,
    inset: 0,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
    position: "absolute"
  },
  overlayTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.display,
    fontSize: 32
  },
  overlayText: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  },
  overlayButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  overlayPrimary: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  overlayPrimaryText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15
  },
  overlaySecondary: {
    backgroundColor: theme.colors.cardMuted,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  overlaySecondaryText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15
  },
  controlsRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md
  },
  controlsRowLandscape: {
    paddingTop: theme.spacing.sm
  }
});
