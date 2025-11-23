<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
      <div class="flex items-center justify-center mb-6">
        <span class="text-xl font-bold bg-gray-800 text-white px-3 py-1 rounded-lg mr-2"
          >M</span
        >
        <span class="text-gray-800 font-medium">Manajemen Inventoris</span>
      </div>

      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-medium mb-2"
            >Email</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-medium mb-2"
            >Password</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gray-200 text-black font-semibold py-2 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          {{ isLoading ? "Memuat..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const api = proxy ? proxy.$api : null;
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    if (!api) {
      errorMessage.value = "Kesalahan internal: Klien API ($api) tidak tersedia.";
      isLoading.value = false;
      return;
    }

    const response = await api.post("login", {
      email: email.value,
      password: password.value,
    });
    const token = response.data.access_token;
    localStorage.setItem("bearer_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    router.push("/");
    window.location.reload();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Kredensial tidak valid. Cek email dan password Anda.";
    } else if (error.response) {
      // Menampilkan error validasi lainnya (422) atau server (500)
      errorMessage.value = "Terjadi kesalahan pada server. Coba lagi.";
      console.error(error.response.data);
    } else {
      errorMessage.value = "Tidak dapat terhubung ke server API.";
      console.error(error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
