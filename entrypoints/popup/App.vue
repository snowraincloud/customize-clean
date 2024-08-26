<script lang="ts" setup>

import { NTabs, NTabPane, NInputNumber, NInput, NButton, NIcon, NSelect, NPopover } from 'naive-ui';
import type { SelectOption } from 'naive-ui'
import { ref } from 'vue'
import { CleanTask } from '~/common/types';
import { sendMessage } from '~/common/message';
import { onMounted, onBeforeUnmount } from 'vue';
import { SettingsSharp} from '@vicons/ionicons5'
import { timeStorage, domainStorage, regexStorage, groupStorage, cleanConfStorage } from '@/common/storage'
import * as _ from 'lodash'


const timeList = ref<Array<SelectOption>>([])
const filterList = ref<Array<SelectOption>>([
])

onMounted(async () => {
  const tmp = _.values(await timeStorage.getValue())
  timeList.value = tmp.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })

  const domainTmp = _.values(await domainStorage.getValue())
  const regexTmp = _.values(await regexStorage.getValue())
  const groupTmp = _.values(await groupStorage.getValue())
  filterList.value = [
    ...groupTmp.map((item) => {
      return {
        label: `group:${item.name}`,
        value: item.id
      }
    }),
    ...domainTmp.map((item) => {
      return {
        label: `domain:${item.name}`,
        value: item.id
      }
    }),
    ...regexTmp.map((item) => {
      return {
        label: `regex:${item.name}`,
        value: item.id
      }
    }),

  ]
})

const cleanTask = ref<CleanTask>({
  timeId: '',
  timeType: 'within',
  filterId: []
})

onMounted(async () => {
  const tmp = await cleanConfStorage.getValue()
  if (tmp) {
    cleanTask.value = JSON.parse(tmp)
  }
})

const showMessage = ref<boolean>(false)
const message = ref<string>('')

const clean = async () => {
  if (showMessage.value) {
    return
  }

  if (!cleanTask.value.timeId) {
    message.value = '请选择时间'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 1000);
    return
  }
  message.value = '清理中...'
  showMessage.value = true
  console.log('clean', cleanTask)
  try {
    const res = await sendMessage('clean', cleanTask.value)
    message.value = '清理完成'
    cleanConfStorage.setValue(JSON.stringify(cleanTask.value))
    
    setTimeout(() => {
      showMessage.value = false
    }, 1000);
  } catch (e) {
    message.value = '清理失败'
    setTimeout(() => {
      showMessage.value = false
    }, 1000);
  }

}

const toSetting = () => {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <n-message-provider>
    <div class="wrapper">
      <div style="display: flex;justify-content: flex-end;">
        <n-icon :component="SettingsSharp" size="20" @click="toSetting"/>
      </div>
      <div>
        <h3>时间</h3>
        <div class="select-wrapper">
          <n-select v-model:value="cleanTask.timeId" :options="timeList" style="width: 150px;" :theme-overrides="{
            peers: {
              InternalSelectMenu: {
                height: '200px'
              }
            }
          }" />
          <n-select v-model:value="cleanTask.timeType"
            :options="[{ label: '之内', value: 'within' }, { label: '之外', value: 'outside' }]" style="width: 100px;" />
        </div>
      </div>
      <div>
        <h3>筛选</h3>
        <n-select v-model:value="cleanTask.filterId" multiple clearable :options="filterList" :theme-overrides="{
          peers: {
            InternalSelectMenu: {
              height: '100px'
            }
          }
        }" />
      </div>
      <div class="btn-wrapper">
        <n-popover trigger="manual" :show="showMessage">
          <template #trigger>
            <n-button tertiary round type="success" @click="clean">
              一键清理
            </n-button>
          </template>
          <span>{{ message }}</span>
        </n-popover>

      </div>
    </div>
  </n-message-provider>
</template>

<style scoped>
.wrapper {
  padding: 30px;
  /* padding-bottom: 100px; */
}

.select-wrapper {
  display: flex;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px;
}
</style>
