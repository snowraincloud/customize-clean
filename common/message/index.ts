import { defineExtensionMessaging } from '@webext-core/messaging';
import { HistoryItem, HistorySearchQuery, CleanTask } from '../types';

interface ProtocolMap {
    search(query: HistorySearchQuery): HistoryItem[];
    delete(urls: Array<string>): void;
    clean(task: CleanTask): string;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();