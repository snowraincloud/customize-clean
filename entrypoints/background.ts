import { onMessage } from "../common/message";
import { HistorySearchQuery, HistoryItem } from "~/common/types"
import { timeStorage, domainStorage, regexStorage, groupStorage } from '@/common/storage'
import * as _ from 'lodash'

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });


  onMessage('search', async (query) => {
    console.log('Search:', query);
    const results = await browser.history.search(query.data);
    console.log('Results:', results);
    return results;
  });

  onMessage('delete', async (urls) => {
    console.log('Delete:', urls);
    urls.data.forEach(async (url) => {
      await browser.history.deleteUrl({ url });
    })
  })

  onMessage('clean', async (paylod) => {
    console.log(paylod.data)
    const task = paylod.data;
    const timeItems = _.values(await timeStorage.getValue())
    const timeItem =_.find(timeItems, (timeItem) => {
      return timeItem.id == task.timeId
    })
    if(timeItem == undefined){
      return "时间范围不存在"
    }
    
    const offset = new Date().getTime() - timeItem.year * 365 * 24 * 60 * 60 * 1000 - timeItem.month * 30 * 24 * 60 * 60 * 1000 - timeItem.day * 24 * 60 * 60 * 1000 - timeItem.hour * 60 * 60 * 1000 - timeItem.minute * 60 * 1000
    if(task.filterId.length == 0){
      if(task.timeType == 'within'){
        const results = await browser.history.deleteRange({
          startTime: offset,
          endTime: new Date().getTime()
        })
        return "删除成功" 
      }else{
        const results = await browser.history.deleteRange({
          startTime: 0,
          endTime: offset
        })
        return "删除成功"
      }
    }

    const domainItems = _.values(await domainStorage.getValue())
    const regexItems = _.values(await regexStorage.getValue())
    const groupItems = _.values(await groupStorage.getValue())
    let filterId = _.cloneDeep(task.filterId)
    const groupFilter = _.filter(groupItems, (groupItem) => {
      return _.includes(filterId, groupItem.id)
    })
    console.log(groupFilter)
    groupFilter.forEach((groupItem) => {
      _.values(groupItem.idList).forEach((id) => {
        filterId.push(id)
      })
    })
    console.log(filterId)
    // filter id remove duplicate
    filterId = _.uniq(filterId)

    const domainFilter = _.filter(domainItems, (domainItem) => {
      return _.includes(filterId, domainItem.id)
    }).map((domainItem) => {
      return domainItem.domain
    })
    

    const regexFilter = _.filter(regexItems, (regexItem) => {
      return _.includes(filterId, regexItem.id)
    }).map((regexItem) => {
      return new RegExp(regexItem.regex)
    })

    console.log(domainFilter)
    console.log(regexFilter)

    const results = await browser.history.search({
      text: "",
      startTime: task.timeType == 'within' ? offset : 0,
      endTime: task.timeType == 'within' ? new Date().getTime() : offset,
      maxResults: 1000000
    });
    console.log('Results:', results);
    
    results.forEach(async (historyItem) => {
      let deleteFlag = false
      if(domainFilter.length > 0){
        const urlObj = new URL(historyItem.url!);
        const urlDomain = urlObj.hostname;
        for(let i = 0; i < domainFilter.length; i++){
          if(urlDomain.endsWith(domainFilter[i])){
            deleteFlag = true
            break
          }
        }
      }
      if(!deleteFlag && regexFilter.length > 0){
        for(let i = 0; i < regexFilter.length; i++){
          if(regexFilter[i].test(historyItem.url!)){
            deleteFlag = true
            break
          }
        }
      }
      if(deleteFlag){
        await browser.history.deleteUrl({ url: historyItem.url! });
      }
    })


    return "删除成功"
  })

});
