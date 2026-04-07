import { Pressable, Animated } from 'react-native'
import React, { useRef, useEffect, useCallback } from 'react'
import { Image } from 'expo-image'


const overlayButtons = [
    {
        name: "rewardCenter",
        image: "https://www.jalwagame.win/assets/png/rewardCenter-f8f2277a.png",
        route: "/rewardCenter",
    },
    {
        name: "turntable",
        image: "https://www.jalwagame.win/assets/png/turntable-4464ae2e.png",
        route: "/turntable",
    },
    {
        name: "tg_bg",
        image: "https://www.jalwagame.win/assets/png/tg_bg-8a7ff21e.png",
        route: "/tg_bg",
    },
    {
        name: "changlong",
        image: "https://www.jalwagame.win/assets/svg/changlong-5c3a8155.svg",
        route: "/changlong",
    },
    {
        name: "icon_sevice",
        image: "https://www.jalwagame.win/assets/png/icon_sevice-65e9fbf7.webp",
        route: "/icon_sevice",
    },
]

// How many px to slide off-screen (buttons are 62px wide + 4% margin ~15px)
const HIDDEN_OFFSET = 62

interface OverlayButtonsModalProps {
    visibleButtons: string[]
    scrolling?: boolean
    bottom?: number
}

const OverlayButtonsModal = ({ visibleButtons, scrolling = false, bottom = 30 }: OverlayButtonsModalProps) => {
    const translateX = useRef(new Animated.Value(0)).current
    const isHidden = useRef(false)

    const hide = useCallback(() => {
        isHidden.current = true
        Animated.timing(translateX, {
            toValue: HIDDEN_OFFSET,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }, [translateX])

    const show = useCallback(() => {
        isHidden.current = false
        Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }, [translateX])

    // Hide instantly when scrolling starts
    useEffect(() => {
        if (scrolling && !isHidden.current) {
            hide()
        }
    }, [scrolling, hide])

    const handlePress = () => {
        if (isHidden.current) {
            show()
        }
    }

    const filtered = overlayButtons.filter((b) => visibleButtons.includes(b.name))

    return (
        <Animated.View
            style={{
                flexDirection: "column",
                gap: 6,
                position: "absolute",
                right: "4%",
                bottom: bottom,
                zIndex: 999,
                transform: [{ translateX }],
            }}
            pointerEvents="box-none"
        >
            {filtered.map((button) => (
                <Pressable key={button.name} onPress={handlePress}>
                    <Image source={{ uri: button.image }} style={{ width: 62, aspectRatio: 1 }} contentFit='cover' />
                </Pressable>
            ))}
        </Animated.View>
    )
}

export default OverlayButtonsModal
