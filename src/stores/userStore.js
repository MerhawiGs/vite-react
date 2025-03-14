import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from '@/axios';

export const useUserStore = defineStore('users', {
  state: () => ({
    firstName: ref(''),
    lastName: ref(''),
    email: ref(''),
    password: ref(''),
    user: ref(localStorage.getItem('user') || ''),
    token: ref(''),
  }),
  actions: {
    async sendMessage(receiver, message) {
      console.log('Sending message:', message);
      try {
        const response = await apiClient.post('/api/message', {
          sender: localStorage.getItem('user'),
          receiver: receiver,
          content: message,
        });
        return response;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    async getMessages(friendEmail) {
      try {
        const response = await apiClient.get('/api/message', {
          params: {
            sender: localStorage.getItem('user'),
            receiver: friendEmail,
          },
        });
        return response;
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    },

    async login() {
      try {
        const response = await apiClient.post('/api/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token); // Store token for authentication
        this.token = response.data.token;
        if (response.data.user) {
          localStorage.setItem("user", response.data.user.email); // Store user data
          
        } else {
          throw new Error('User data not found');
        }
        return response;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },

    async signup() {
      try {
        const response = await apiClient.post('/api/signup', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        });
        return response;
      } catch (error) {
        console.error('Error during signup:', error);
        throw error;
      }
    },

    async getAllUsers() {
      console.log('Fetching all users in store.......');
      try {
        const response = await apiClient.get('/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        return response;
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    },

    async fetchUserInfo() {
      try {
        const response = await apiClient.get('/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        return response;
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      }
    },
  },
});