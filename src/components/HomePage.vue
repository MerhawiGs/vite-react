<script setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ScrollPanel from 'primevue/scrollpanel';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import 'primeicons/primeicons.css';
import InputText from 'primevue/inputtext';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { onMounted } from 'vue';

import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';

import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';

const userStore = useUserStore();
const friends = ref([]);
const messages = ref({});
const selectedFriend = ref(null);

onMounted(() => {
    getFriends();
});

const items = ref([
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-times'
    }
]);

const message = ref('');
const sendMessage = async () => {
    if (!selectedFriend.value) {
        console.error("No friend selected");
        return;
    }
    // console.log("Message: " + message.value);
    // console.log("Sender: " + localStorage.getItem('user'));
    // console.log("Receiver: " + selectedFriend.value.email);

    try {
        const res = await userStore.sendMessage(selectedFriend.value.email, message.value);
        console.log("Message sent successfully");
        if (res.status === 200) {
            messages.value.push({ id: Date.now(), content: message.value });
            message.value = '';
        }
    } catch (err) {
        console.error(err);
    }
};
const selectFriend = async (friend) => {
    selectedFriend.value = friend;
    try {
        const res = await userStore.getMessages(friend.email);
        console.log("Messages: ", res.data);
        if (res.status === 200) {
            messages.value = res.data;
        }
    } catch (err) {
        console.error(err);
    }


};

const getFriends = async () => {

    console.log('Fetching all users.......');
    try {
        const res = await userStore.getAllUsers();
        if (res.status === 200) {
            friends.value = res.data;
        }
    } catch (err) {
        console.error(err);
    }
};


const value1 = ref(null);

</script>

<template>
    <div class="card">
        <Splitter style="height: 96vh; margin: 18px; border-radius: 20px;">
            <SplitterPanel class="flex items-center justify-between w-[25%]" :size="25" :maxSize="25">
                <ScrollPanel style="width: 100%; height: 97vh">
                    <div
                        style="position: sticky; top: 0; background-color: #18181b; border-radius: 20px 0px 0px 0px; height: 60px; padding: 1px; border-bottom: 1px gray solid;">
                        <h2 class="ml-2 text-white font-sans text-lg"
                            style="margin: 15px 10px 1px 13px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                            Chats</h2>
                    </div>
                    <br>
                    <IconField style="margin: 5px;">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="value1"
                            style="width: 97%; margin: 5px; border-color: rgba(255, 255, 255, 0.4);"
                            placeholder="Search" />
                    </IconField>
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Personal</Tab>
                            <Tab value="1">Groups</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <ul class="list-none flex flex-col w-[100%]">
                                    <li class="flex flex-row justify-between p-2 hover:bg-gray-700 hover:cursor-pointer w-full"
                                        v-for="friend in friends" :key="friend.email" @click="selectFriend(friend)">
                                        <div class="flex flex-row">
                                            <Avatar :label="friend.firstName.charAt(0) + friend.lastName.charAt(0)"
                                                :image="friend.profile" class="ml-[-20px]" size="small"
                                                style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                                            <div class="flex flex-col ml-2">
                                                <span class="font-medium" v-if="friend.email !== userStore.user">{{
                                                    friend.firstName + ' ' + friend.lastName
                                                    }}</span>
                                                <span class="font-medium" v-else>You</span>
                                                <div class="text-sm text-surface-500 dark:text-surface-400">Last seen 2
                                                    hours ago</div>
                                            </div>
                                        </div>
                                        <Badge value="6" severity="secondary"></Badge>
                                    </li>
                                </ul>
                            </TabPanel>
                            <TabPanel value="1">
                                <p class="m-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                                    doloremque laudantium,
                                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                    beatae vitae
                                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                                    odit aut fugit,
                                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                    Consectetur, adipisci
                                    velit, sed quia non numquam eius modi.
                                </p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ScrollPanel>
            </SplitterPanel>
            <SplitterPanel :size="60" :maxSize="70">
                <Splitter layout="vertical">
                    <SplitterPanel v-if="selectedFriend" class="flex p-2 items-center justify-start ml-4">
                        <div class="flex flex-row" v-if="selectedFriend">
                            <Avatar :label="selectedFriend.firstName.charAt(0) + selectedFriend.lastName.charAt(0)"
                                :image="selectedFriend.profile" size="small"
                                style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                            <div class="flex flex-col ml-2">
                                <span class="font-medium">{{ selectedFriend.firstName + ' ' + selectedFriend.lastName
                                    }}</span>
                                <div class="text-sm text-surface-500 dark:text-surface-400">Last seen 2 hours ago</div>
                            </div>
                        </div>
                        <div class="flex flex-row" v-if="!selectedFriend">
                            <span class="font-medium">Select a chat to start messaging.</span>
                        </div>
                    </SplitterPanel>
                    <SplitterPanel class="flex items-center justify-center h-9/12">
                        <ScrollPanel style="padding: 20px; width: 100%; height: 97vh">

                            <div v-if="!selectedFriend" class="flex justify-center items-center w-full mt-[30%]">
                                <span class="font-medium">Select a chat to start messaging.</span>
                            </div>
                            <div class="flex flex-col justify-start align-start items-start" v-if="selectedFriend"
                                style="flex-direction: column-reverse;">

                                <div v-for="message in messages" :key="message.id">
                                    <div class="flex flex-row my-2 ml-2 items-center justify-start w-full">
                                        <Avatar
                                            :label="message.sender === userStore.user ? 'You' : selectedFriend.firstName.charAt(0) + selectedFriend.lastName.charAt(0)"
                                            size="small" class="ml-2 bg-gray-500" :style="{ 'background-color': message.sender === userStore.user ? '#3498db' : '#e5e5e5' }"
                                            style="background-color: #ece9fc; color: #2a1261" shape="circle"></Avatar>
                                       
                                        <div class="flex flex-col ml-2" style="padding: 20px;">
                                            <span class="font-small">{{ selectedFriend.firstName 
                                                }}</span>
                                            <div class="text-sm text-surface-500 dark:text-surface-400 font-large">{{ message.content }}</div>
                                        </div>
                                    </div>

                                </div>


                                <!-- <div v-for="message in messages" :key="message.id"
                                    class="flex flex-row items-center justify-start w-full">
                                    <Avatar :label="message.sender === userStore.user ? 'You' : selectedFriend.firstName.charAt(0) + selectedFriend.lastName.charAt(0)"
                                        :image="message.sender === userStore.user ? userStore.profile : selectedFriend.profile" size="small"
                                        style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                                    <div class="flex flex-col ml-2">
                                        <span class="font-medium">{{ message.sender === userStore.user ? 'You' :
                                            selectedFriend.firstName }}</span>
                                        <span class="text-sm text-gray-600 dark:text-blue-400">{{
                                            message.content }}</span>
                                    </div>
                                </div> -->

                            </div>
                        </ScrollPanel>
                    </SplitterPanel>
                    <SplitterPanel class="h-1.5/12" v-if="selectedFriend">
                        <Splitter>
                            <SplitterPanel class="flex items-center justify-center" :size="15" :minSize="15"
                                :maxSize="15">
                                <Toolbar
                                    class="w-full flex flex-row items-center justify-center bg-transparent border-none">
                                    <template #start>
                                        <Button icon="pi pi-file" class="mr-2" severity="secondary" />
                                        <Button icon="pi pi-upload" severity="secondary" />
                                    </template>

                                    <template #center>
                                        <IconField>
                                            <InputIcon>
                                                <i class="pi pi-message-circle" />
                                            </InputIcon>
                                            <InputText v-model="message" style="width: 550px;"
                                                placeholder="Write your message" />
                                        </IconField>
                                    </template>

                                    <template #end>
                                        <Button icon="pi pi-send" @click="sendMessage" class="mr-2"
                                            severity="secondary" />
                                    </template>
                                </Toolbar>
                            </SplitterPanel>
                        </Splitter>
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
            <SplitterPanel v-if="selectedFriend" class="w-[20%] flex items-center justify-center" :size="20"
                :maxSize="30">
                {{ useUserStore.user }}
            </SplitterPanel>
        </Splitter>
    </div>
</template>
