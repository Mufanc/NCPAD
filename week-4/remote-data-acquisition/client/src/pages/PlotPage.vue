<template>
    <div class="w-full h-full flex flex-col">
        <el-row :gutter="10" class="flex-grow-1">
            <el-col :span="12" class="bg-green"></el-col>
            <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="10" class="flex-grow-1 mt-10px">
            <el-col :span="12"></el-col>
            <el-col :span="12" class="bg-green"></el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
