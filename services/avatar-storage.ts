import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";

const SELECTED_AVATAR_KEY = "@jalwa_selected_avatar";

export const DEFAULT_AVATAR_ID = "avatar-20";

export type AvatarOption = {
  id: string;
  source: ImageSourcePropType;
  pickerSelectedSource?: ImageSourcePropType;
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "avatar-01",
    source: require("@/assets/avatar-crops/avatar-01.png"),
  },
  {
    id: "avatar-02",
    source: require("@/assets/avatar-crops/avatar-02.png"),
  },
  {
    id: "avatar-03",
    source: require("@/assets/avatar-crops/avatar-03.png"),
  },
  {
    id: "avatar-04",
    source: require("@/assets/avatar-crops/avatar-04.png"),
  },
  {
    id: "avatar-05",
    source: require("@/assets/avatar-crops/avatar-05.png"),
  },
  {
    id: "avatar-06",
    source: require("@/assets/avatar-crops/avatar-06.png"),
  },
  {
    id: "avatar-07",
    source: require("@/assets/avatar-crops/avatar-07.png"),
  },
  {
    id: "avatar-08",
    source: require("@/assets/avatar-crops/avatar-08.png"),
  },
  {
    id: "avatar-09",
    source: require("@/assets/avatar-crops/avatar-09.png"),
  },
  {
    id: "avatar-10",
    source: require("@/assets/avatar-crops/avatar-10.png"),
  },
  {
    id: "avatar-11",
    source: require("@/assets/avatar-crops/avatar-11.png"),
  },
  {
    id: "avatar-12",
    source: require("@/assets/avatar-crops/avatar-12.png"),
  },
  {
    id: "avatar-13",
    source: require("@/assets/avatar-crops/avatar-13.png"),
  },
  {
    id: "avatar-14",
    source: require("@/assets/avatar-crops/avatar-14.png"),
  },
  {
    id: "avatar-15",
    source: require("@/assets/avatar-crops/avatar-15.png"),
  },
  {
    id: "avatar-16",
    source: require("@/assets/avatar-crops/avatar-16.png"),
  },
  {
    id: "avatar-17",
    source: require("@/assets/avatar-crops/avatar-17.png"),
  },
  {
    id: "avatar-18",
    source: require("@/assets/avatar-crops/avatar-18.png"),
  },
  {
    id: "avatar-19",
    source: require("@/assets/avatar-crops/avatar-19.png"),
  },
  {
    id: "avatar-20",
    source: require("@/assets/avatar-crops/avatar-20-base.png"),
    pickerSelectedSource: require("@/assets/avatar-crops/avatar-20.png"),
  },
];

const avatarById = new Map(AVATAR_OPTIONS.map((avatar) => [avatar.id, avatar]));

export function getAvatarOption(avatarId: string): AvatarOption {
  return avatarById.get(avatarId) ?? avatarById.get(DEFAULT_AVATAR_ID)!;
}

export function getAvatarImageSource(
  avatarId: string
): ImageSourcePropType {
  return getAvatarOption(avatarId).source;
}

export function getAvatarPickerSource(
  avatarId: string,
  isSelected: boolean
): ImageSourcePropType {
  const avatar = getAvatarOption(avatarId);
  return isSelected && avatar.pickerSelectedSource
    ? avatar.pickerSelectedSource
    : avatar.source;
}

export async function getSelectedAvatarId(): Promise<string> {
  try {
    const avatarId = await AsyncStorage.getItem(SELECTED_AVATAR_KEY);
    return avatarId && avatarById.has(avatarId) ? avatarId : DEFAULT_AVATAR_ID;
  } catch {
    return DEFAULT_AVATAR_ID;
  }
}

export async function storeSelectedAvatarId(avatarId: string): Promise<void> {
  if (!avatarById.has(avatarId)) {
    return;
  }

  try {
    await AsyncStorage.setItem(SELECTED_AVATAR_KEY, avatarId);
  } catch {
    // Ignore storage errors and keep the current in-memory selection.
  }
}
