<script lang="ts" setup>
import { NTabs, NTabPane, NMessageProvider, NDialogProvider } from 'naive-ui';
import List from './components/List.vue';
import Setting from './components/Setting.vue';
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <div class="wrapper">
        <n-tabs type="line" animated placement="left">
          <n-tab-pane name="list" tab="Chrome 历史纪录">
            <List />
          </n-tab-pane>
          <n-tab-pane name="setting" tab="高级设置">
            <Setting />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-dialog-provider>
  </n-message-provider>

</template>

<style scoped>
.wrapper {
  /* margin-top: 15px; */
  padding: 10px;
}
</style>
