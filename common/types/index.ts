import { History } from 'webextension-polyfill';

export interface HistoryItem extends History.HistoryItem {}
export interface HistorySearchQuery extends History.SearchQueryType {}


export interface TimeItem {
    id: string;
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}


export interface DomainItem {
    id: string;
    name: string;
    domain: string;
}

export interface RegexItem {
    id: string;
    name: string;
    regex: string;
}


export interface GroupItem{
    id: string;
    name: string;
    idList: string[];
}

export type TimeType = 'within' | 'outside';

export interface CleanTask{
    timeId: string;
    timeType: TimeType;
    filterId: string[];
}