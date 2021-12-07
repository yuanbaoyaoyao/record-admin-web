<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="admin-info">
                        <div>
                            <span>管理员信息</span>
                        </div>
                        <img src class="user-avator" />
                        <div class="user-info-cont">
                            <!-- <div class="user-info-name">{{ name }}</div> -->
                            <!-- <div>{{ role }}</div> -->
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2019-11-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>东莞</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover">
                    <div>
                        <span>用户领用信息</span>
                    </div>
                    <div class="user-info">
                        <ul class="top">
                            <li>名称</li>
                            <li>时间</li>
                            <li>事件</li>
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
                        <div class="chart" style="width: 350px;height:400px;">
                            <Bar />
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="month-info">
                        <span>本月信息</span>
                        <div class="chart" style="width: 350px;height:400px;">
                            <Line />
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="year-info">
                        <span>本年信息</span>
                        <div class="chart" style="width: 350px;height:400px;">
                            <Pie />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Bar from "../components/Charts/Bar.vue"
import Pie from "../components/Charts/Pie.vue"
import Line from "../components/Charts/Line.vue"
export default {
    components: {
        Bar,
        Pie,
        Line
    }
}
</script>


<style>
.el-row {
    margin-bottom: 20px;
}
.el-col {
    border-radius: 4px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.top {
    width: 95%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin: 0 auto;
    font-size: 14px;
    color: #909399;
    background: #fafafa;
}
.top li {
    width: 34%;
    text-align: center;
    overflow: hidden;
}
</style>