<template>
    <div v-if="isAuthenticated" id="app" class="min-h-screen flex">

        <aside class="w-64 border-r border-gray-200 text-black flex flex-col justify-between p-4">
            <div>
                <div class="flex items-center mb-8">
                    <span class="bg-black text-xl text-white px-2 py-1 rounded-xl mr-2">M</span>
                    <div class="flex flex-col leading-none">
                        <span class="text-gray-500 text-base font-normal">managemen</span>
                        <span class="text-gray-900 text-xl">inventaris.</span>
                    </div>
                </div>

                <nav>
                    <router-link to="/"
                        class="flex items-center p-3 rounded-lg hover:bg-gray-200 transition duration-150 mb-2"
                        active-class="bg-gray-200">
                        Data Inventaris
                    </router-link>
                    <router-link to="/anggota"
                        class="flex items-center p-3 rounded-lg hover:bg-gray-200 transition duration-150 mb-2"
                        active-class="bg-gray-200">
                        Management Anggota
                    </router-link>
                    <router-link to="/analytic"
                        class="flex items-center p-3 rounded-lg hover:bg-gray-200 transition duration-150"
                        active-class="bg-gray-200">
                        Analitycs
                    </router-link>
                </nav>
            </div>

            <div class="border rounded-lg p-4 bg-gray-100">
                <div class="flex items-center mb-4">
                    <div
                        class="w-10 h-10 rounded-full mr-3 bg-gray-600 flex items-center justify-center text-sm font-bold">
                        TT</div>
                    <div>
                        <div class="text-sm font-semibold">Admin</div>
                        <div class="text-xs text-gray-400">admin@example.com</div>
                    </div>
                </div>
                <button @click="handleLogout"
                    class="w-full text-left p-2 rounded-lg text-gray-400 hover:text-black hover:transition duration-700">
                    Logout
                </button>
            </div>
        </aside>
        <main class="flex-1 overflow-y-auto p-6">
            <router-view></router-view>
        </main>
    </div>
    <div v-if="!isAuthenticated">
        <router-view></router-view>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const api = proxy ? proxy.$api : null;
const router = useRouter();

const isAuthenticated = computed(() => {
    return !!localStorage.getItem('bearer_token');
});

const handleLogout = async () => {
    try {
        await api.post('logout');

    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        localStorage.removeItem('bearer_token');
        delete api.defaults.headers.common['Authorization'];
        router.push('/login');
        window.location.reload();
    }
};

if (isAuthenticated.value) {
    const token = localStorage.getItem('bearer_token');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
</script>