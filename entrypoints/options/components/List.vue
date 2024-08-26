<script lang="ts" setup>
import { NDatePicker, NIcon, NInput, NButton, NDataTable } from 'naive-ui'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { SearchSharp, Trash } from '@vicons/ionicons5'
import { ref } from 'vue'
import { HistoryItem, HistorySearchQuery } from '~/common/types';
import { sendMessage } from '~/common/message';
import moment from 'moment';
import { onMounted } from 'vue';
// default now
const range = ref<[number, number] | null>([ moment().startOf('day').toDate().getTime(), new Date().getTime()])

const searchTitle = ref<string>('')
const search = async () => {
    console.log('search', searchTitle, range)
    const searchQuery: HistorySearchQuery = {
        text: searchTitle.value,
        maxResults: 1000000
    }
    if (range.value) {
        searchQuery.startTime = range.value[0]
        searchQuery.endTime = range.value[1]
    }

    const res = await sendMessage('search', searchQuery)
    console.log('search res', res)
    data.value = res
}

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const rowKey = (row: HistoryItem) => row.url!
const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
}

const del = async () => {
    console.log('selected', checkedRowKeysRef.value)
    if (checkedRowKeysRef.value.length === 0) {
        return
    }
    const res = await sendMessage('delete', checkedRowKeysRef.value as string[])
    await search()
}

onMounted(() => {
    search()
})



const columns = ref<DataTableColumns<HistoryItem>>([
    {
        type: 'selection'
    },
    {
        title: 'LastVisitTime',
        key: 'lastVisitTime',
        sorter: 'default',
        width: 200,
        render: (row: HistoryItem, _) => {
            // yyyy-MM-dd HH:mm:ss
            return moment(row.lastVisitTime).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    {
        title: "VisitCount",
        key: "visitCount",
        sorter: "default",
        width: 120,
        align: "center"
    },
    {
        title: 'Title',
        key: 'title',
        sorter: 'default',
        minWidth: 300
    },
    {
        title: 'Url',
        key: 'url',
        sorter: 'default'
    },
])

const data = ref<Array<HistoryItem>>([
])



const pagination = ref({ pageSize: 5 })

</script>
<template>
    <div class="wrapper">
        <div class="head">
            <n-input round placeholder="Search for title" style="width: 500px;" v-model:value="searchTitle">
            </n-input>
            <n-date-picker round v-model:value="range" type="datetimerange" clearable />
            <n-button round @click="search">
                <template #icon>
                    <n-icon :component="SearchSharp" />
                </template>
            </n-button>
            <n-button round @click="del">
                <template #icon>
                    <n-icon :component="Trash" />
                </template>
            </n-button>
        </div>
        <div class="content">
            <n-data-table :columns="columns" :data="data" :row-key="rowKey" @update:checked-row-keys="handleCheck"
                striped />
        </div>
    </div>
</template>
<style scoped>
.head {
    display: flex;
    margin-bottom: 20px;
    gap: 10px;
    justify-content: center;
}

.content {
    padding: 10px;
}
</style>
