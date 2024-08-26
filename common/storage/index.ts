import { storage } from 'wxt/storage';
import { TimeItem, DomainItem, RegexItem, GroupItem } from '@/common/types'


export const timeStorage = storage.defineItem<Array<TimeItem>>(
    'local:timeItems',
    {
        version: 1,
        defaultValue: [
            {
                id: '1',
                name: '一年',
                year: 1,
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
            },
            {
                id: '2',
                name: '一月',
                year: 0,
                month: 1,
                day: 0,
                hour: 0,
                minute: 0,
            },
            {
                id: '3',
                name: '一周',
                year: 0,
                month: 0,
                day: 7,
                hour: 0,
                minute: 0,
            },
            {
                id: '4',
                name: '一天',
                year: 0,
                month: 0,
                day: 1,
                hour: 0,
                minute: 0,
            },
            {
                id: '5',
                name: '一小时',
                year: 0,
                month: 0,
                day: 0,
                hour: 1,
                minute: 0,
            },
            {
                id: '6',
                name: '一分钟',
                year: 0,
                month: 0,
                day: 0,
                hour: 0,
                minute: 1,
            },
        ],
    },
);


export const domainStorage = storage.defineItem<DomainItem[]>(
    'local:domainItems',
    {
        version: 1,
        defaultValue: [
            {
                id: '1',
                name: 'Test',
                domain: 'test.com',
            },
        ],
    },
);


export const regexStorage = storage.defineItem<RegexItem[]>(
    'local:regexItems',
    {
        version: 1,
        defaultValue: [
            {
                id: '2',
                name: 'Test',
                regex: '^test$',
            },
        ],
    },
);


export const groupStorage = storage.defineItem<GroupItem[]>(
    'local:groupItems',
    {
        version: 1,
        defaultValue: [
            {
                id: '3',
                name: 'Test',
                idList: ['1', '2'],
            },
        ],
    },
);


export const cleanConfStorage = storage.defineItem<string>(
    'local:cleanConf',
    {
        version: 1,
        defaultValue: '{"timeId":"","timeType":"within","filterId":[]}',
    },
);
