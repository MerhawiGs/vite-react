<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Account created succesfully!', life: 3000 });
};

const userStore = useUserStore();

const fname = ref('');
const lname = ref('');
const email = ref('');
const password = ref('');
const c_password = ref('');
const terms = ref(false);

const signup = async () => {
  if (password.value !== c_password.value) {
    alert('Password and Confirm Password do not match');
    return;
  } else if (password.value.length < 3) {
    alert('Password must be at least 3 characters');
    return;
  } else if (!terms.value) {
    alert('Please agree to the terms and conditions');
    return;
  } else {
    userStore.firstName = fname.value;
    userStore.lastName = lname.value;
    userStore.email = email.value;
    userStore.password = password.value;
    try {
      const res = await userStore.signup();
        showSuccess();
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response.data.message) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error: '+ err.response.data.message, life: 3000 });
      }
      
    }
  }
}
</script>
<template>
  <div>

    <Toast />
    <Card style="width: 450px; margin: 0 auto; padding: 20px; margin-top: 100px;">
    <template #header>
      <Toast />
      <span id="title">Create an account</span>
      <h4>Already have an account? <router-link to="/">Login</router-link></h4>
    </template>
    <template #content>
      <InputText type="text" v-model="fname" placeholder="First name" class="nameField" />
      <InputText type="text" v-model="lname" placeholder="Last name" class="nameField" />
      <InputText type="text" v-model="email" placeholder="Email" class="emailField" />
      <Password v-model="password" size="large" placeholder="Password" :feedback="false" class="passwordField" toggleMask/>
      <Password v-model="c_password" size="large" placeholder="Confirm Password" :feedback="false" class="cPasswordFields" toggleMask/>

      <div class="flex items-center gap-2">
        <Checkbox v-model="terms" inputId="term" name="term" value="term" style="margin-top: 5px;" />
        <label for="term"> I agree to the terms and conditions </label>
      </div>
      <Button @click="signup()" label="Sign Up" style="width: 100%; padding: 10px; margin-top: 15px;" />
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
Card {
  width: 450px;
  margin: 0 auto;
  margin-top: 100px;
}
h4 {
  margin-top: 10px;
  font-size: 0.8em;
  color: #bebebe;
  font-family: sans-serif;
}
.nameField {
  float: left;
  padding: 13px;
  width: 49%;
  margin: 0px 3px 5px 0px;
}
.emailField {
  padding: 10px;
  width: 99%;
  margin: 0px 0px 5px 0px;
}
.passwordField {
  float: left;
}
.cPasswordFields {
  margin-top: 5px;
}
</style>
