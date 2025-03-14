<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully!', life: 3000 });
};

const email = ref('');
const password = ref('');

const userStore = useUserStore();

const login = async () => {
  userStore.email = email.value;
  userStore.password = password.value;
  try {
    const res = await userStore.login();
    if (res.status === 200) {
      showSuccess();
      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
    } else if (res.data.message) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error: ' + res.data.message, life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error: Something went wrong', life: 3000 });
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error: ' + err.message, life: 3000 });
  }
};
</script>

<template>
  <div>
    <Toast />
    <Card id="card">
      <template #title>
        <span id="title">Login</span>
        <h4>Create an account? <router-link to="/signup">Signup</router-link></h4>
      </template>
      <template #content>
        <InputText type="text" v-model="email" placeholder="Email" style="width: 248px; padding: 11.5px;" />
        <Password v-model="password" :feedback="false" size="large" style="width: 100%; margin: 4px 0 4px 0;" />
        <Button @click="login()" label="Login" style="width: 248px; padding: 10px; margin-top: 15px;" />
      </template>
    </Card>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
#title {
  font-size: 2em;
  font-weight: bold;
}
#card {
  width: 400px;
  padding: 40px;
  margin: 0 auto;
  margin-top: 100px;
}
h4 {
  margin-top: 10px;
  font-size: 0.7em;
  color: #bebebe;
  font-family: sans-serif;
}
</style>