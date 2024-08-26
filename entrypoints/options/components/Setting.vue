<script lang="ts" setup>

import { NTabs, NTabPane, NInputNumber, NInput, NButton, NIcon, NSelect, NUpload, useMessage, useDialog } from 'naive-ui';
import { v4 as uuidv4 } from 'uuid';
import { Remove, Add } from '@vicons/ionicons5'
import { ref } from 'vue'
import { TimeItem, DomainItem, RegexItem, GroupItem } from '~/common/types';
import { onMounted, onBeforeUnmount } from 'vue';
import { timeStorage, domainStorage, regexStorage, groupStorage } from '@/common/storage'
import * as _ from 'lodash'
const message = useMessage()
const dialog = useDialog()

const timeList = ref<Array<TimeItem>>([])

onMounted(async () => {
    timeList.value = await timeStorage.getValue()
    timeList.value = _.values(timeList.value)
})

const delTime = (item: TimeItem) => {
    const index = timeList.value.findIndex(i => i.id === item.id)
    timeList.value.splice(index, 1)
}

const addTime = (idx: number) => {

    timeList.value.splice(idx + 1, 0, {
        id: uuidv4(),
        name: "",
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
    })
}


const domainList = ref<Array<DomainItem>>([
])

onMounted(async () => {
    domainList.value = await domainStorage.getValue()
    domainList.value = _.values(domainList.value)
})

const delDomain = (item: DomainItem) => {
    const index = domainList.value.findIndex(i => i.id === item.id)
    domainList.value.splice(index, 1)
}

const addDomain = (idx: number) => {

    domainList.value.splice(idx + 1, 0, {
        id: uuidv4(),
        name: "",
        domain: "",
    })
}

const regexList = ref<Array<RegexItem>>([
])

onMounted(async () => {
    regexList.value = await regexStorage.getValue()
    regexList.value = _.values(regexList.value)
})

const delRegex = (item: RegexItem) => {
    const index = regexList.value.findIndex(i => i.id === item.id)
    regexList.value.splice(index, 1)
}

const addRegex = (idx: number) => {

    regexList.value.splice(idx + 1, 0, {
        id: uuidv4(),
        name: "",
        regex: "",
    })
}

const groupList = ref<Array<GroupItem>>([
])

const groupOptions = ref<Array<{ label: string, value: string }>>([])

const tabChange = (name: string) => {
    if (name === 'group') {
        const temp = []
        for (const item of domainList.value) {
            temp.push({
                label: `domain:${item.name}`,
                value: `${item.id}`
            })
        }
        for (const item of regexList.value) {
            temp.push({
                label: `regex:${item.name}`,
                value: `${item.id}`
            })
        }
        groupOptions.value = temp
        console.log('groupOptions', groupOptions.value)
        console.log('groupList', groupList.value)
    }
}

onMounted(async () => {
    groupList.value = await groupStorage.getValue()
    const tmp = _.values(groupList.value)
    for (const item of tmp) {
        item.idList = _.values(item.idList)
    }
    groupList.value = tmp
})


const delGroup = (item: GroupItem) => {
    const index = groupList.value.findIndex(i => i.id === item.id)
    groupList.value.splice(index, 1)
}

const addGroup = (idx: number) => {

    groupList.value.splice(idx + 1, 0, {
        id: uuidv4(),
        name: "",
        idList: []
    })
}

const save = () => {
    console.log('timeList', timeList.value)
    console.log('domainList', domainList.value)
    console.log('regexList', regexList.value)
    console.log('groupList', groupList.value)
    timeStorage.setValue(timeList.value)
    domainStorage.setValue(domainList.value)
    regexStorage.setValue(regexList.value)
    groupStorage.setValue(groupList.value)
}

onMounted(() => {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            console.log('hidden')
            save()
        }
    })
})

onBeforeUnmount(async () => {
    console.log('before unmount')
    document.removeEventListener('visibilitychange', () => {
    })
    save()
})

// 导出 JSON 函数
const exportToJson = () => {
    const data = {
        timeList: timeList.value,
        domainList: domainList.value,
        regexList: regexList.value,
        groupList: groupList.value
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'settings.json';
    link.click();
    URL.revokeObjectURL(link.href);
};
// 导入 JSON 函数
const importFromJson = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            console.log(data)
            const { timeList: t, domainList: d, regexList: r, groupList: g } = data;
            const timeListTmp = _.cloneDeep(timeList.value)
            for (const item of t) {
                timeListTmp.push({
                    ...item,
                    id: uuidv4()
                })
            }
            timeList.value = timeListTmp
            const domainListTmp = _.cloneDeep(domainList.value)
            for (const item of d) {
                domainListTmp.push({
                    ...item,
                    id: uuidv4()
                })
            }
            domainList.value = domainListTmp
            const regexListTmp = _.cloneDeep(regexList.value)
            for (const item of r) {
                regexListTmp.push({
                    ...item,
                    id: uuidv4()
                })
            }
            regexList.value = regexListTmp
            const groupListTmp = _.cloneDeep(groupList.value)
            for (const item of g) {
                groupListTmp.push({
                    ...item,
                    id: uuidv4()
                })
            }
            groupList.value = groupListTmp
            save()
            message.success("导入成功")


        } catch (err) {
            message.warning("导入失败：", err)
        }
    };
    console.log(file)
    reader.readAsText(file.file.file);
    return false; // 阻止自动上传
};
</script>
<template>
    <div class="wrapper">
        <n-tabs type="line" animated :on-update:value="tabChange">
            <n-tab-pane name="time" tab="时间">
                <div class="content-wrapper">
                    <div v-if="timeList.length == 0">
                        <n-button circle @click="addTime(0)">
                            <template #icon>
                                <n-icon :component="Add" />
                            </template>
                        </n-button>
                    </div>
                    <div class="content" v-for="(item, idx) of timeList">
                        <div class="item-wrapper">
                            <span class="item" style="width: 250px;">名称: <n-input v-model:value="item.name"
                                    style="width: 200px;" /></span>
                            <span class="item">年: <n-input-number v-model:value="item.year" /></span>
                            <span class="item">月: <n-input-number v-model:value="item.month" /></span>
                            <span class="item">日: <n-input-number v-model:value="item.day" /></span>
                            <span class="item">时: <n-input-number v-model:value="item.hour" /></span>
                            <span class="item">分: <n-input-number v-model:value="item.minute" /></span>
                            <span class="item" style="margin-left: 20px;">
                                <n-button circle @click="delTime(item)">
                                    <template #icon>
                                        <n-icon :component="Remove" />
                                    </template>
                                </n-button>
                                <n-button circle @click="addTime(idx)">
                                    <template #icon>
                                        <n-icon :component="Add" />
                                    </template>
                                </n-button>
                            </span>
                        </div>
                    </div>
                </div>

            </n-tab-pane>
            <n-tab-pane name="domain" tab="域名">
                <div class="content-wrapper">
                    <div v-if="domainList.length == 0">
                        <n-button circle @click="addDomain(0)">
                            <template #icon>
                                <n-icon :component="Add" />
                            </template>
                        </n-button>
                    </div>
                    <div class="content" v-for="(item, idx) of domainList">
                        <div class="item-wrapper">
                            <span class="item" style="width: 250px;">名称: <n-input v-model:value="item.name"
                                    style="width: 200px;" /></span>
                            <span class="item" style="width: 250px;">域名: <n-input v-model:value="item.domain"
                                    style="width: 200px;" /></span>
                            <span class="item" style="margin-left: 20px;">
                                <n-button circle @click="delDomain(item)">
                                    <template #icon>
                                        <n-icon :component="Remove" />
                                    </template>
                                </n-button>
                                <n-button circle @click="addDomain(idx)">
                                    <template #icon>
                                        <n-icon :component="Add" />
                                    </template>
                                </n-button>
                            </span>
                        </div>
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="regex" tab="正则">
                <div class="content-wrapper">
                    <div v-if="regexList.length == 0">
                        <n-button circle @click="addRegex(0)">
                            <template #icon>
                                <n-icon :component="Add" />
                            </template>
                        </n-button>
                    </div>
                    <div class="content" v-for="(item, idx) of regexList">
                        <div class="item-wrapper">
                            <span class="item" style="width: 250px;">名称: <n-input v-model:value="item.name"
                                    style="width: 200px;" /></span>
                            <span class="item" style="width: 250px;">正则: <n-input v-model:value="item.regex"
                                    style="width: 200px;" /></span>
                            <span class="item" style="margin-left: 20px;">
                                <n-button circle @click="delRegex(item)">
                                    <template #icon>
                                        <n-icon :component="Remove" />
                                    </template>
                                </n-button>
                                <n-button circle @click="addRegex(idx)">
                                    <template #icon>
                                        <n-icon :component="Add" />
                                    </template>
                                </n-button>
                            </span>
                        </div>
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="group" tab="分组">
                <div class="content-wrapper">
                    <div v-if="groupList.length == 0">
                        <n-button circle @click="addGroup(0)">
                            <template #icon>
                                <n-icon :component="Add" />
                            </template>
                        </n-button>
                    </div>
                    <div class="content" v-for="(item, idx) of groupList">
                        <div class="item-wrapper">
                            <span class="item" style="width: 250px;">名称: <n-input v-model:value="item.name"
                                    style="width: 200px;" /></span>
                            <span class="item" style="width: 250px;">选择: <n-select v-model:value="item.idList" clearable
                                    :options="groupOptions" multiple style="width: 200px;" /></span>
                            <span class="item" style="margin-left: 20px;">
                                <n-button circle @click="delGroup(item)">
                                    <template #icon>
                                        <n-icon :component="Remove" />
                                    </template>
                                </n-button>
                                <n-button circle @click="addGroup(idx)">
                                    <template #icon>
                                        <n-icon :component="Add" />
                                    </template>
                                </n-button>
                            </span>
                        </div>
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="setting" tab="导入导出">
                <div class="content-wrapper">
                    <div style="display: flex; gap: 10px;">
                        <n-button @click="exportToJson">导出配置</n-button>
                        <n-upload accept=".json" @before-upload="importFromJson" :max="1">
                            <n-button>导入配置</n-button>
                        </n-upload>
                    </div>

                </div>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
<style scoped>
.content-wrapper {
    padding: 20px;
}

.content {
    display: flex;
}

.item-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 10px;
    margin-bottom: 20px;
    box-shadow: 0 0 2px #ccc;
}

.item {
    display: flex;
    align-items: center;
    width: 150px;
    gap: 10px;

}
</style>
