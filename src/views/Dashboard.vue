<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div>
                        <span>管理员信息</span>
                    </div>
                    <hr class="hr" />
                    <div class="admin-info">
                        <img src="../assets/logo.jpg" class="admin-avator" />
                        <div class="admin-info-cont">
                            <div class="admin-info-name">元宝</div>
                            <div class="admin-info-role">超级管理员</div>
                        </div>
                    </div>
                    <hr />
                    <div class="admin-info-list">
                        <div>
                            上次登录时间：
                            <span>2019-11-01</span>
                        </div>
                        <div>
                            上次登录地点：
                            <span>东莞</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover">
                    <div>
                        <span>用户领用信息</span>
                    </div>
                    <hr />
                    <div>
                        <ul class="user-info">
                            <li>名称</li>
                            <li>时间</li>
                            <li>事件</li>
                        </ul>
                    </div>
                    <div class="user-info-list">
                        <ul v-for="(item,index) in listData" :key="index">
                            <li class="user-info-list-detail">
                                <span>{{ item.name }}</span>
                                <span>{{ item.time }}</span>
                                <span>{{ item.event }}</span>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="stock-info">
                        <span>库存信息</span>
                        <hr />
                        <div class="chart">
                            <Bar />
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="month-info">
                        <span>本月信息</span>
                        <hr />
                        <div class="chart">
                            <Line />
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="year-info">
                        <span>本年信息</span>
                        <hr />
                        <div class="chart">
                            <Pie />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import Bar from "../components/Charts/Bar.vue"
import Pie from "../components/Charts/Pie.vue"
import Line from "../components/Charts/Line.vue"
const listData = [
    {
        name: "qwe",
        time: "2021/12/7",
        event: "need a card"
    },
    {
        name: "qwe",
        time: "2021/12/7",
        event: "need a card"
    },
    {
        name: "qwe",
        time: "2021/12/7",
        event: "need a card"
    },
    {
        name: "qwe",
        time: "2021/12/7",
        event: "need a card"
    },
]
</script>


<style >
.admin-info {
    display: flex;
    flex-direction: row;
    margin: 10px;
}
.admin-info-cont {
    display: flex;
    flex-direction: column;
    align-self: center;
    margin: auto;
}
.admin-info-name {
    margin: auto;
    font-size: xx-large;
    font-family: Cursive;
}
.admin-info-list {
    margin-top: 12px;
}
.user-info-list-detail {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-self: center;
    text-align: center;
}
.el-row {
    margin-bottom: 20px;
}
.el-col {
    border-radius: 4px;
}
.admin-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-self: center;
    text-align: center;
    font-size: 14px;
    color: #909399;
    background: #fafafa;
}
.user-info li {
    text-align: center;
    overflow: hidden;
}
</style>