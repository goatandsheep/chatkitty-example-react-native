import ChatKitty from 'chatkitty';
import { CHATKITTY_INSTANCE } from 'react-native-dotenv';

export const kitty = ChatKitty.getInstance(CHATKITTY_INSTANCE);

export function getChannelDisplayName(channel) {
  if (channel.type === 'DIRECT') {
    return channel.members.map((member) => member.displayName).join(', ');
  } else {
    return channel.name;
  }
}
