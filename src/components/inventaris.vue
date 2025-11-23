<template>
    <div class="p-6 bg-white min-h-screen">

        <div class="flex justify-between items-center mb-6 border-b pb-4">
            <h1 class="text-xl font-semibold text-gray-800">Data Inventaris</h1>
            <div class="flex items-center space-x-4">

                <input v-model="searchTerm" type="text" placeholder="Search Inventaris..."
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" />

                <button @click="openModal('create')"
                    class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition duration-200">
                    + Tambah Data
                </button>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Memuat data inventaris...</div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Gagal memuat data: {{ error }}
        </div>

        <div v-else-if="inventaris.length" class="overflow-x-auto">
            <table class="min-w-full leading-normal">
                <thead>
                    <tr class="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th class="px-5 py-3 border-b-2 border-gray-200">No.</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Inventaris ID</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Barang</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Type</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Serial Number</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Spesifikasi</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Status</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Assign</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Department</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredInventaris" :key="item.id"
                        class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-5 py-3 text-sm">{{ index + 1 }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.inventaris_id }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.barang }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.type }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.serial_number }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.spesifikasi }}</td>
                        <td class="px-5 py-3 text-sm">
                            <span :class="getStatusClass(item.status)"
                                class="px-3 py-1 text-xs font-semibold rounded-full leading-tight">
                                {{ item.status }}
                            </span>
                        </td>
                        <td class="px-5 py-3 text-sm">{{ item.anggota ? item.anggota.nama : 'N/A' }}</td>
                        <td class="px-5 py-3 text-sm">{{ item.department }}</td>
                        <td class="px-5 py-3 text-sm overflow-visible relative">
                            <ActionDropdown @action="(action) => handleAction(action, item)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="text-center py-10 text-gray-500">
            Tidak ada data inventaris ditemukan.
        </div>
    </div>

    <Teleport to="body">
        <InventoryModal :isVisible="isModalOpen" :mode="modalMode" :inventoryData="selectedItem" :members="members"
            :departments="departments" @close="isModalOpen = false" @save="handleSave" />
    </Teleport>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import InventoryModal from '../Action/inventoryModal.vue'; // ✅ Pastikan path import ini benar!
import ActionDropdown from '../Action/dropDown.vue'; // ✅ Import komponen baru

// ... (fetchInventaris, openModal, deleteData functions) ...

// ✅ Handler Aksi dari Dropdown
const handleAction = (action, item) => {
    if (action === 'edit') {
        openModal('edit', item);
    } else if (action === 'delete') {
        deleteData(item.id);
    }
};

const { proxy } = getCurrentInstance();
const api = proxy ? proxy.$api : null;

// State Data
const inventaris = ref([]);
const members = ref([]); // ✅ State untuk daftar anggota (Assign dropdown)
const departments = ref(['Technology', 'HR', 'Finance', 'Marketing']); // ✅ Data Department
const isLoading = ref(true);
const error = ref(null);
const searchTerm = ref('');

// State Modal
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create' atau 'edit'
const selectedItem = ref({});

// --- FETCH DATA ---

const fetchMembers = async () => {
    try {
        const response = await api.get('anggota');
        // Mapping data untuk dropdown: { id, name }
        members.value = response.data.data.map(member => ({
            id: member.id,
            name: member.nama
        }));
    } catch (err) {
        console.error("Gagal memuat daftar anggota:", err);
    }
};

const fetchInventaris = async () => {
    isLoading.value = true;
    error.value = null;
    if (!api) { error.value = "Klien API tidak tersedia."; isLoading.value = false; return; }

    try {
        // GET /api/inventaris (Harus dengan with('anggota') di Laravel)
        const response = await api.get('inventaris');
        inventaris.value = response.data.data;
    } catch (err) {
        error.value = "Gagal memuat data inventaris.";
    } finally {
        isLoading.value = false;
    }
};

// --- SEARCH ---
const filteredInventaris = computed(() => {
    if (!searchTerm.value) {
        return inventaris.value;
    }
    const term = searchTerm.value.toLowerCase();
    return inventaris.value.filter(item =>
        item.barang.toLowerCase().includes(term) ||
        item.inventaris_id.toLowerCase().includes(term) ||
        (item.anggota && item.anggota.nama.toLowerCase().includes(term)) // ✅ Search berdasarkan Nama Anggota
    );
});


// --- MODAL & CRUD HANDLERS ---
const openModal = (mode, item = null) => {
    modalMode.value = mode;

    if (item) {
        // Clone data, pastikan ID anggota yang dikirim adalah ID anggota
        selectedItem.value = {
            ...item,
            // ✅ Pastikan Anda mengambil ID jika relasi 'anggota' ada
            assign: item.anggota ? item.anggota.id : item.assign || null
        };
    } else {
        // Create Mode
        selectedItem.value = { /* ... default values ... */ };
    }
    isModalOpen.value = true;
};

const handleSave = async (payload) => {
    isModalOpen.value = false;
    try {
        if (modalMode.value === 'create') {
            await api.post('inventaris', payload);
        } else {
            await api.put(`inventaris/${payload.id}`, payload);
        }
        alert(`Data ${modalMode.value === 'create' ? 'ditambah' : 'diubah'} berhasil!`);
        fetchInventaris();
    } catch (err) {
        error.value = `Gagal menyimpan data: ${err.response?.data?.message || 'Kesalahan API'}`;
    }
};

const deleteData = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data inventaris ini?')) return;
    try {
        await api.delete(`inventaris/${id}`);
        alert('Data berhasil dihapus!');
        fetchInventaris();
    } catch (err) {
        error.value = `Gagal menghapus data: ${err.response?.data?.message || 'Kesalahan API'}`;
    }
};

const getStatusClass = (status) => {
    // ... (Logika styling badge) ...
    switch (status) {
        case 'Baik': return 'bg-green-200 text-green-800';
        case 'Rusak': return 'bg-red-200 text-red-800';
        case 'Tidak Dipakai': return 'bg-gray-200 text-gray-800';
        case 'Dilelang': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-blue-100 text-blue-800';
    }
};

onMounted(() => {
    fetchMembers();
    fetchInventaris();
});
</script>