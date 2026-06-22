import React from "react";
import botAvatar from "../assets/bot-avatar.svg";

export const BOT_AVATAR_SRC = botAvatar;

export const isBotAvatar = (src?: string) =>
  !!src && (src === BOT_AVATAR_SRC || src.endsWith("/bot-avatar.svg") || src.includes("bot-avatar"));

interface Props {
  size?: number;
  className?: string;
  alt?: string;
}

const BotAvatar: React.FC<Props> = ({ size = 48, className = "", alt = "Bot avatar" }) => (
  <img
    src={BOT_AVATAR_SRC}
    alt={alt}
    width={size}
    height={size}
    className={className}
    referrerPolicy="no-referrer"
    draggable={false}
  />
);

export default BotAvatar;
