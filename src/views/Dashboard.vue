<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class="admin-info">
                        <img src="" class="user-avator" alt="">
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class="user-info">用户传递信息</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="stock-info">库存信息</div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="month-info">本月信息</div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="year-info">本年信息</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

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

</style>