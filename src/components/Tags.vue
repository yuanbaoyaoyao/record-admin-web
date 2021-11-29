<template>
    <div class="tags">
        <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
            <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            >{{ item.content }}</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
export default {
    data() {
        return {
            editableTabsValue: '2',
            editableTabs: [
                {
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content',
                },
                {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content',
                },
            ],
            tabIndex: 2,
        }
    },
    methods: {
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                const newTabName = `${++this.tabIndex}`
                this.editableTabs.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content',
                })
                this.editableTabsValue = newTabName
            }
            if (action === 'remove') {
                const tabs = this.editableTabs
                let activeName = this.editableTabsValue
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            const nextTab = tabs[index + 1] || tabs[index - 1]
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                        }
                    })
                }

                this.editableTabsValue = activeName
                this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
            }
        },
    },
}
</script>

<style>
.tags {
    position: relative;
    height: 41px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    /* box-shadow: 0 5px 10px #ddd; */
    /* margin: 60px; */
    /* margin-left: 181px; */
    margin-top: 0px;
    width: 100%;
}
</style>
