import { getToken } from '@/services/auth-storage'
import { Pressable, Animated, Linking } from 'react-native'
import React, { useRef, useEffect, useCallback } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const SUPPORT_PORTAL_URL = 'https://support.indgames.online/'
const WINGO_SCREEN = '/wingo'
const TURNTABLE_SCREEN = '/home-banner-one'

type OverlayButton = {
    name: string
    image: string
    route?: string
    url?: string
    /** Same link as Account → Customer Service (token in query when logged in). */
    supportWithToken?: boolean
}

const overlayButtons: OverlayButton[] = [
    {
        name: "rewardCenter",
        image: "https://www.jalwagame.win/assets/png/rewardCenter-f8f2277a.png",
        route: WINGO_SCREEN,
    },
    {
        name: "turntable",
        image: "https://www.jalwagame.win/assets/png/turntable-4464ae2e.png",
        route: TURNTABLE_SCREEN,
    },
    {
        name: "tg_bg",
        image: "https://www.jalwagame.win/assets/png/tg_bg-8a7ff21e.png",
        url: "https://t.me/Jalwa_Channel_Official",
    },
    {
        name: "changlong",
        image: "https://www.jalwagame.win/assets/svg/changlong-5c3a8155.svg",
        route: WINGO_SCREEN,
    },
    {
        name: "icon_sevice",
        image: "https://www.jalwagame.win/assets/png/icon_sevice-65e9fbf7.webp",
        supportWithToken: true,
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
    const router = useRouter()
    const translateX = useRef(new Animated.Value(0)).current
    const isHidden = useRef(false)
    const autoShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    // Hide when scrolling starts; auto-show 3s after scrolling stops
    useEffect(() => {
        if (autoShowTimer.current) {
            clearTimeout(autoShowTimer.current)
            autoShowTimer.current = null
        }

        if (scrolling) {
            if (!isHidden.current) hide()
        } else if (isHidden.current) {
            autoShowTimer.current = setTimeout(() => {
                show()
            }, 2000)
        }

        return () => {
            if (autoShowTimer.current) {
                clearTimeout(autoShowTimer.current)
                autoShowTimer.current = null
            }
        }
    }, [scrolling, hide, show])

    const handleButtonPress = useCallback(
        async (button: OverlayButton) => {
            if (isHidden.current) {
                show()
                return
            }
            if (button.supportWithToken) {
                const token = await getToken()
                let url = SUPPORT_PORTAL_URL
                if (token) {
                    url += `?token=${encodeURIComponent(token)}`
                }
                void Linking.openURL(url)
                return
            }
            if (button.url) {
                void Linking.openURL(button.url)
                return
            }
            if (button.route) {
                router.push(button.route as `/`)
            }
        },
        [router, show],
    )

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
                <Pressable key={button.name} onPress={() => handleButtonPress(button)}>
                    <Image source={{ uri: button.image }} style={{ width: 62, aspectRatio: 1 }} contentFit='cover' />
                </Pressable>
            ))}
        </Animated.View>
    )
}

export default OverlayButtonsModal
